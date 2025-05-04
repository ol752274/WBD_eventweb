// __tests__/routes.test.js

const request = require('supertest');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

require('dotenv').config();
jest.setTimeout(15000);

let server;

beforeAll((done) => {
  server = app.listen(3000, () => {
    console.log('Test server running on port 3000');
    done();
  });
});

afterAll(async () => {
  await mongoose.connection.close(); // close MongoDB connection
  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
});
afterAll(async () => {
  await redis.quit();
});

// —— Mock all models & bcrypt ——
jest.mock('../models/User');
jest.mock('../models/Roles');
jest.mock('../models/empRegistrations');
jest.mock('../models/Employee');
jest.mock('../models/eventBookings');
jest.mock('../models/Logs');
jest.mock('bcryptjs');

const User = require('../models/User');
const Role = require('../models/Roles');
const empRegistrations = require('../models/empRegistrations');
const Employee = require('../models/Employee');
const Booking = require('../models/eventBookings');
const Log = require('../models/Logs');
const redis = require('../services/redisClient');
const bcrypt = require('bcryptjs');

// —— Import routers ——
const authRoutes      = require('../routes/authRoutes');
const bookRoutes      = require('../routes/bookRoutes');
const dashBoardRoutes = require('../routes/dashBoardRoutes');
const empDashRoutes   = require('../routes/empDashRoutes');
const statRoutes      = require('../routes/statRoutes');

// —— App setup ——
const app = express();
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'testsecret',
  resave: false,
  saveUninitialized: true
}));
app.use(authRoutes);
app.use(bookRoutes);
app.use(dashBoardRoutes);
app.use(empDashRoutes);
app.use(statRoutes);

// —— Combined test suite ——
describe('All Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  // — Auth Routes —
  describe('Auth Routes', () => {
    describe('POST /signup', () => {
      it('201 on valid signup', async () => {
        User.findOne.mockResolvedValue(null);
        bcrypt.genSalt.mockResolvedValue('salt');
        bcrypt.hash.mockResolvedValue('hashedpw');
        User.prototype.save = jest.fn().mockResolvedValue();
        Role.prototype.save = jest.fn().mockResolvedValue();

        const res = await request(app)
          .post('/signup')
          .send({
            name: 'Alice',
            email: 'alice@example.com',
            phone: '1234567890',
            password: 'Pass@123',
            confirmPassword: 'Pass@123'
          });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ message: 'User registered successfully' });
      });

      it('400 on password mismatch', async () => {
        const res = await request(app)
          .post('/signup')
          .send({
            name: 'Bob',
            email: 'bob@example.com',
            phone: '1112223333',
            password: 'Pass@123',
            confirmPassword: 'Pass@124'
          });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: 'Passwords do not match' });
      });

      it('400 on duplicate email', async () => {
        User.findOne.mockResolvedValue({ email: 'carol@example.com' });

        const res = await request(app)
          .post('/signup')
          .send({
            name: 'Carol',
            email: 'carol@example.com',
            phone: '4445556666',
            password: 'Pass@123',
            confirmPassword: 'Pass@123'
          });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: 'User already exists' });
      });
    });

    describe('POST /login', () => {
      it('200 + redirect on valid login', async () => {
        Role.findOne = jest.fn().mockResolvedValue({ email: 'u@u.com', password: 'hash', role: 'User' });
        bcrypt.compare.mockResolvedValue(true);

        const res = await request(app)
          .post('/login')
          .send({ email: 'u@u.com', password: 'Pass@123' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
          success: true,
          role: 'User',
          redirectUrl: '/mainUser'
        });
      });

      it('404 when no role entry', async () => {
        Role.findOne = jest.fn().mockResolvedValue(null);

        const res = await request(app)
          .post('/login')
          .send({ email: 'noone@example.com', password: 'Pass@123' });

        expect(res.statusCode).toBe(404);
        expect(res.text).toBe('Role not found');
      });

      it('400 on wrong password', async () => {
        Role.findOne = jest.fn().mockResolvedValue({ email: 'u@u.com', password: 'hash', role: 'User' });
        bcrypt.compare.mockResolvedValue(false);

        const res = await request(app)
          .post('/login')
          .send({ email: 'u@u.com', password: 'Wrong123' });

        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Invalid credentials');
      });
    });

    describe('POST /logout', () => {
      it('200 on logout', async () => {
        const agent = request.agent(app);
        Role.findOne = jest.fn().mockResolvedValue({ email: 'x@x.com', password: 'hash', role: 'User' });
        bcrypt.compare.mockResolvedValue(true);
        await agent.post('/login').send({ email: 'x@x.com', password: 'Pass@123' });

        const res = await agent.post('/logout');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ success: true, message: 'Logged out successfully' });
      });
    });

    describe('GET /user/checksession', () => {
      it('200 when session exists', async () => {
        const agent = request.agent(app);
        Role.findOne = jest.fn().mockResolvedValue({ email: 'a@a.com', password: 'hash', role: 'Admin' });
        bcrypt.compare.mockResolvedValue(true);
        await agent.post('/login').send({ email: 'a@a.com', password: 'Pass@123' });

        const res = await agent.get('/user/checksession');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ role: 'Admin' });
      });

      it('401 when no session', async () => {
        const res = await request(app).get('/user/checksession');
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({ message: 'Not authenticated' });
      });
    });

    describe('POST /register (employee)', () => {
      it('201 on valid employee register', async () => {
        empRegistrations.findOne.mockResolvedValue(null);
        bcrypt.genSalt.mockResolvedValue('salt');
        bcrypt.hash.mockResolvedValue('hpass');
        empRegistrations.prototype.save = jest.fn().mockResolvedValue();

        const res = await request(app)
          .post('/register')
          .field('firstName', 'E')
          .field('lastName', 'User')
          .field('email', 'e@e.com')
          .field('phone', '999')
          .field('password', 'Pass@123')
          .attach('image', Buffer.from(''), 'img.png');

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ message: 'Your registration will be approved by us very soon' });
      });

      it('400 on duplicate employee email', async () => {
        empRegistrations.findOne.mockResolvedValue({ email: 'dup@e.com' });

        const res = await request(app)
          .post('/register')
          .field('firstName', 'E')
          .field('email', 'dup@e.com')
          .field('password', 'Pass@123')
          .attach('image', Buffer.from(''), 'img.png');

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: 'You have already registered' });
      });
    });

    describe('Password Reset', () => {
      it('200 on forgot-password success', async () => {
        User.findOne.mockResolvedValue({ email: 'f@e.com' });
        const res = await request(app)
          .post('/forgot-password')
          .send({ email: 'f@e.com' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Password reset link sent successfully' });
      });

      it('404 on forgot-password no user', async () => {
        User.findOne.mockResolvedValue(null);

        const res = await request(app)
          .post('/forgot-password')
          .send({ email: 'no@e.com' });

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: 'User not found' });
      });

      it('200 on reset-password success', async () => {
        User.findOne.mockResolvedValue({ email: 'r@e.com', save: jest.fn() });
        Role.findOne = jest.fn().mockResolvedValue({ email: 'r@e.com', save: jest.fn() });

        const res = await request(app)
          .post('/reset-password')
          .send({ email: 'r@e.com', newPassword: 'New@123' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Password updated successfully!' });
      });
    });
  });

  // — Booking Routes —
  describe('Booking Routes', () => {
    const valid = {
      startDate: '2025-06-01',
      endDate: '2025-06-05',
      employeeEmail: 'emp@e.com',
      organizerDetails: { email: 'user@u.com' }
    };

    it('POST /book → 201', async () => {
      app.request.session = { email: 'user@u.com', role: 'User' };
      Employee.findOne.mockResolvedValue({ email: 'emp@e.com', employmentPeriods: [], save: jest.fn() });
      Booking.findOne.mockResolvedValue(null);
      Booking.prototype.save = jest.fn().mockResolvedValue(valid);

      const res = await request(app).post('/book').send(valid);
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Booking saved successfully');
    });

    it('POST /book → 403 wrong role', async () => {
      app.request.session = { email: 'mgr@mgr.com', role: 'Admin' };
      const res = await request(app).post('/book').send(valid);
      expect(res.statusCode).toBe(403);
      expect(res.body).toEqual({ error: 'Unauthorized: Only Users can book' });
    });

    it('POST /book → 400 invalid dates', async () => {
      app.request.session = { email: 'user@u.com', role: 'User' };
      const bad = { ...valid, startDate: '2025-06-05', endDate: '2025-06-05' };
      const res = await request(app).post('/book').send(bad);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'End date must be after the start date' });
    });

    it('GET /employees → 200', async () => {
      Employee.find.mockResolvedValue([{ email: 'x@x.com' }]);
      const res = await request(app).get('/employees');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ email: 'x@x.com' }]);
    });

    it('GET /check-session → 200', async () => {
      app.request.session = { foo: 'bar' };
      const res = await request(app).get('/check-session');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ foo: 'bar' });
    });

    it('GET /bookings → 200', async () => {
      Booking.find.mockResolvedValue([{ id: 1 }]);
      const res = await request(app).get('/bookings');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ id: 1 }]);
    });

    it('DELETE /bookings/:id → 200', async () => {
      const bk = { _id: 'b1', employeeEmail: 'emp@e.com', startDate: '2025-06-01', endDate: '2025-06-05' };
      Booking.findById.mockResolvedValue(bk);
      Employee.findOne.mockResolvedValue({
        employmentPeriods: [{ _id: 'p1', startDate: '2025-06-01', endDate: '2025-06-05' }]
      });
      Booking.findByIdAndDelete.mockResolvedValue();
      Log.prototype.save = jest.fn().mockResolvedValue();
      const res = await request(app).delete('/bookings/b1');
      expect(res.statusCode).toBe(200);
    });

    it('GET /my-bookings → 404 & 200', async () => {
      app.request.session = { email: 'emp@e.com' };
      Booking.find.mockResolvedValue([]);
      let res = await request(app).get('/my-bookings');
      expect(res.statusCode).toBe(404);
      Booking.find.mockResolvedValue([{ id: 2 }]);
      res = await request(app).get('/my-bookings');
      expect(res.statusCode).toBe(200);
    });

    it('GET /MeAsUserBookings → 404 & 200', async () => {
      app.request.session = { email: 'user@u.com' };
      Booking.find.mockResolvedValue([]);
      let res = await request(app).get('/MeAsUserBookings');
      expect(res.statusCode).toBe(404);
      Booking.find.mockResolvedValue([{ id: 3 }]);
      res = await request(app).get('/MeAsUserBookings');
      expect(res.statusCode).toBe(200);
    });

    it('POST /bookings/:id/rate → 200 & 400', async () => {
      const booking = { employeeEmail: 'emp@e.com' };
      const emp = { rating: 1, rateCount: 1, save: jest.fn() };
      Booking.findById.mockResolvedValue(booking);
      Employee.findOne.mockResolvedValue(emp);
      let res = await request(app).post('/bookings/x/rate').send({ rating: 3 });
      expect(res.statusCode).toBe(200);
      res = await request(app).post('/bookings/x/rate').send({ rating: 10 });
      expect(res.statusCode).toBe(400);
    });
  });

  // — Dashboard Routes —
  describe('Dashboard Routes', () => {


    it('POST /approveEmployee/:id → 200 & 404', async () => {
      const reg = { _id: 'r1', email: 'e@e', firstName: 'A', lastName: 'B', maritalStatus:'', dob:'', phone:'', street:'', city:'', state:'', country:'', experience:'', skills:'', password:'', image:''};
      empRegistrations.findById.mockResolvedValue(reg);
      Employee.findOne.mockResolvedValue(null);
      Employee.prototype.save = jest.fn().mockResolvedValue();
      Role.prototype.save = jest.fn().mockResolvedValue();
      empRegistrations.findByIdAndDelete = jest.fn().mockResolvedValue();
      let res = await request(app).post('/approveEmployee/r1');
      expect(res.statusCode).toBe(200);
      empRegistrations.findById.mockResolvedValue(null);
      res = await request(app).post('/approveEmployee/none');
      expect(res.statusCode).toBe(404);
    });


    it('DELETE /deleteEmployee/:id → 200 & 404', async () => {
      const emp = { _id: 'e1', email: 'e@e' };
      Employee.findById.mockResolvedValue(emp);
      Employee.findByIdAndDelete = jest.fn().mockResolvedValue();
      Role.findOneAndDelete = jest.fn().mockResolvedValue();
      let res = await request(app).delete('/deleteEmployee/e1');
      expect(res.statusCode).toBe(200);
      Employee.findById.mockResolvedValue(null);
      res = await request(app).delete('/deleteEmployee/none');
      expect(res.statusCode).toBe(404);
    });

    it('DELETE /deleteEmpRegistrations/:id → 200 & 404', async () => {
      const r = { _id: 'r2', email: 'r@r' };
      empRegistrations.findById.mockResolvedValue(r);
      empRegistrations.findByIdAndDelete = jest.fn().mockResolvedValue();
      Role.findOneAndDelete = jest.fn().mockResolvedValue();
      let res = await request(app).delete('/deleteEmpRegistrations/r2');
      expect(res.statusCode).toBe(200);
      empRegistrations.findById.mockResolvedValue(null);
      res = await request(app).delete('/deleteEmpRegistrations/none');
      expect(res.statusCode).toBe(404);
    });

    it('DELETE /deleteUsers/:id → 204 & 404', async () => {
      User.findByIdAndDelete = jest.fn().mockResolvedValue({ email: 'u@u' });
      Role.findOneAndDelete = jest.fn().mockResolvedValue();
      let res = await request(app).delete('/deleteUsers/uid');
      expect(res.statusCode).toBe(204);
      User.findByIdAndDelete = jest.fn().mockResolvedValue(null);
      res = await request(app).delete('/deleteUsers/none');
      expect(res.statusCode).toBe(404);
    });

    it('GET /getAdminName → 200, 401, 404', async () => {
      const agent = request.agent(app);
      app.request.session = { email: 'a@a.com' };
      Role.findOne = jest.fn().mockResolvedValue({ email: 'a@a.com', role: 'Admin' });
      let res = await agent.get('/getAdminName');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true, adminName: 'a@a.com' });
      app.request.session = null;
      res = await request(app).get('/getAdminName');
      expect(res.statusCode).toBe(401);
      app.request.session = { email: 'u@u.com' };
      Role.findOne = jest.fn().mockResolvedValue({ email: 'u@u.com', role: 'User' });
      res = await request(app).get('/getAdminName');
      expect(res.statusCode).toBe(404);
    });

    it('GET & POST user profile → 200 & 401', async () => {
      const agent = request.agent(app);
      app.request.session = { email: 'u@u.com' };
      User.findOne = jest.fn().mockResolvedValue({ _id: 'id', name: 'N', email: 'u@u.com', phone: '123', save: jest.fn() });
      let res = await agent.get('/getMyUserProfileDetails');
      expect(res.statusCode).toBe(200);
      res = await agent.post('/updateMyUserProfile').send({ name: 'N2', phone: '999' });
      expect(res.statusCode).toBe(200);
      app.request.session = null;
      res = await request(app).get('/getMyUserProfileDetails');
      expect(res.statusCode).toBe(401);
    });
  });

  // — Employee Dashboard Routes —
  describe('Employee Dashboard Routes', () => {

    it('POST /updateEmpProfile → 200,400,404', async () => {
      let res;
      // missing
      res = await request(app).post('/updateEmpProfile').send({}); expect(res.statusCode).toBe(400);
      // not found
      Employee.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      res = await request(app).post('/updateEmpProfile').send({ employeeId: 'no' }); expect(res.statusCode).toBe(404);
      // success
      Employee.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id:'e1', firstName:'F' });
      res = await request(app).post('/updateEmpProfile').send({ employeeId:'e1', firstName:'F' }); expect(res.statusCode).toBe(200); expect(res.body.employee.firstName).toBe('F');
    });
  });

  // — Statistics Routes —
  describe('Statistics Routes', () => {
    it('GET /trailAdmin → 200 grouped', async () => {
      Booking.find = jest.fn().mockResolvedValue([
        { eventType:'W', totalPrice:100 },
        { eventType:'B', totalPrice:50 },
        { eventType:'W', totalPrice:25 }
      ]);
      const res = await request(app).get('/trailAdmin');
      expect(res.statusCode).toBe(200);
      expect(res.body.W).toMatchObject({ totalIncome:125, bookingCount:2 });
      expect(res.body.B).toMatchObject({ totalIncome:50, bookingCount:1 });
    });
  });
});
