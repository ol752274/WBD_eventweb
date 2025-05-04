// __tests__/routes.test.js
const request = require('supertest');
const express = require('express');
const session = require('express-session');
require('dotenv').config();
jest.setTimeout(15000);

// --- MOCK ALL MODELS & BCRYPT ---
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
const bcrypt = require('bcryptjs');

// --- IMPORT ROUTERS ---
const authRoutes      = require('../routes/authRoutes');
const bookRoutes      = require('../routes/bookRoutes');
const dashBoardRoutes = require('../routes/dashBoardRoutes');
const empDashRoutes   = require('../routes/empDashRoutes');
const statRoutes      = require('../routes/statRoutes');

// --- BUILD APP ---
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

// --- TEST SUITE ---
describe('All Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  // -------------------
  //  AUTH ROUTES
  // -------------------
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
            password: 'pass1!',
            confirmPassword: 'pass1!'
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
            phone: '9876543210',
            password: 'pw1',
            confirmPassword: 'pw2'
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
            phone: '5555555555',
            password: 'pass1!',
            confirmPassword: 'pass1!'
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
          .send({ email: 'u@u.com', password: 'pw' });

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
          .send({ email: 'x@y.com', password: 'pw' });

        expect(res.statusCode).toBe(404);
        expect(res.text).toBe('Role not found');
      });

      it('400 on bad password', async () => {
        Role.findOne = jest.fn().mockResolvedValue({ email: 'e@e.com', password: 'hash', role: 'User' });
        bcrypt.compare.mockResolvedValue(false);

        const res = await request(app)
          .post('/login')
          .send({ email: 'e@e.com', password: 'wrong' });

        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Invalid credentials');
      });
    });

    describe('POST /logout', () => {
      it('200 on logout', async () => {
        const agent = request.agent(app);
        Role.findOne = jest.fn().mockResolvedValue({ email: 'h@h.com', password: 'hash', role: 'User' });
        bcrypt.compare.mockResolvedValue(true);
        await agent.post('/login').send({ email: 'h@h.com', password: 'pw' });

        const res = await agent.post('/logout');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ success: true, message: 'Logged out successfully' });
      });
    });

    describe('GET /user/checksession', () => {
      it('200 when session exists', async () => {
        const agent = request.agent(app);
        Role.findOne = jest.fn().mockResolvedValue({ email: 'a@a.com', password: 'h', role: 'Admin' });
        bcrypt.compare.mockResolvedValue(true);
        await agent.post('/login').send({ email: 'a@a.com', password: 'h' });

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
          .field('firstName', 'Test')
          .field('lastName', 'User')
          .field('email', 'test@e.com')
          .field('phone', '123')
          .field('password', 'Pwd@123')
          .attach('image', Buffer.from(''), 'img.png');

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ message: 'Your registration will be approved by us very soon' });
      });

      it('400 when duplicate employee email', async () => {
        empRegistrations.findOne.mockResolvedValue({ email: 'dup@e.com' });
        const res = await request(app)
          .post('/register')
          .field('firstName', 'X')
          .field('email', 'dup@e.com')
          .field('password', 'Pwd@1')
          .attach('image', Buffer.from(''), 'img.png');

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: 'You have already registered' });
      });
    });

    describe('POST /forgot-password & /reset-password', () => {
      it('200 when forgot-password sends link', async () => {
        User.findOne.mockResolvedValue({ email: 'f@e.com' });
        jest.spyOn(global, 'setTimeout'); // suppress nodemailer
        const res = await request(app)
          .post('/forgot-password')
          .send({ email: 'f@e.com' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Password reset link sent successfully' });
      });

      it('404 when forgot-password no user', async () => {
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

  // -------------------
  //  BOOKING ROUTES
  // -------------------
  describe('Booking Routes', () => {
    const valid = {
      startDate: '2025-06-01',
      endDate:   '2025-06-05',
      employeeEmail: 'e@e.com',
      organizerDetails: { email: 'u@u.com' }
    };

    it('POST /book → 201', async () => {
      app.request.session = { email: 'u@u.com', role: 'User' };
      Employee.findOne.mockResolvedValue({ email: 'e@e.com', employmentPeriods: [], save: jest.fn() });
      Booking.findOne.mockResolvedValue(null);
      Booking.prototype.save = jest.fn().mockResolvedValue(valid);

      const res = await request(app).post('/book').send(valid);
      expect(res.statusCode).toBe(201);
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

    it('GET /trailAdmin → 200', async () => {
      Booking.find.mockResolvedValue([
        { eventType: 'A', totalPrice: 10 },
        { eventType: 'A', totalPrice: 5 },
        { eventType: 'B', totalPrice: 2 }
      ]);
      const res = await request(app).get('/trailAdmin');
      expect(res.statusCode).toBe(200);
      expect(res.body.A).toMatchObject({ totalIncome: 15, bookingCount: 2 });
      expect(res.body.B).toMatchObject({ totalIncome: 2, bookingCount: 1 });
    });
  });

  // -------------------
  //  DASHBOARD ROUTES
  // -------------------
  describe('Dashboard Routes', () => {
    it('GET /manageEmpRegistrations → 200', async () => {
      empRegistrations.find.mockResolvedValue([{ id: 1 }]);
      const res = await request(app).get('/manageEmpRegistrations');
      expect(res.statusCode).toBe(200);
    });

    it('POST /approveEmployee/:id → 200 & 404', async () => {
      const reg = { _id: 'r1', email: 'n@e', firstName:'A', lastName:'B', maritalStatus:'', dob:'', phone:'', street:'', city:'', state:'', country:'', experience:'', skills:'', password:'', image:'' };
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

    it('GET /manageEmployees → 200', async () => {
      Employee.find.mockResolvedValue([{ id: 2 }]);
      const res = await request(app).get('/manageEmployees');
      expect(res.statusCode).toBe(200);
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

    it('GET /getAdminName → 200,401,404', async () => {
      const agent = request.agent(app);
      app.request.session = { email: 'a@a' };
      Role.findOne = jest.fn().mockResolvedValue({ email: 'a@a', role: 'Admin' });
      let res = await agent.get('/getAdminName');
      expect(res.statusCode).toBe(200);

      app.request.session = null;
      res = await request(app).get('/getAdminName');
      expect(res.statusCode).toBe(401);

      app.request.session = { email: 'u@u' };
      Role.findOne = jest.fn().mockResolvedValue({ email: 'u@u', role: 'User' });
      res = await request(app).get('/getAdminName');
      expect(res.statusCode).toBe(404);
    });

    it('GET /getMyUserProfileDetails & POST /updateMyUserProfile', async () => {
      const agent = request.agent(app);
      app.request.session = { email: 'u@u' };

      User.findOne = jest.fn().mockResolvedValue({ _id:'id', name:'N', email:'u@u', phone:'123', save: jest.fn() });
      let res = await agent.get('/getMyUserProfileDetails');
      expect(res.statusCode).toBe(200);

      res = await agent.post('/updateMyUserProfile').send({ name: 'New', phone: '999' });
      expect(res.statusCode).toBe(200);
    });
  });

  // -------------------
  //  EMPLOYEE DASHBOARD
  // -------------------
  describe('Employee Dashboard Routes', () => {
    it('GET /getMyEmpProfileDetails → 200 & 401 & 404', async () => {
      app.request.session = { email: 'e@e' };
      Employee.findOne = jest.fn().mockResolvedValue({ email: 'e@e' });
      let res = await request(app).get('/getMyEmpProfileDetails');
      expect(res.statusCode).toBe(200);

      app.request.session = null;
      res = await request(app).get('/getMyEmpProfileDetails');
      expect(res.statusCode).toBe(401);

      app.request.session = { email: 'x@x' };
      Employee.findOne = jest.fn().mockResolvedValue(null);
      res = await request(app).get('/getMyEmpProfileDetails');
      expect(res.statusCode).toBe(404);
    });

    it('POST /updateEmpProfile → 200 & 400 & 404', async () => {
      app.request.session = { }; // irrelevant here
      const updated = { _id:'eid', save: jest.fn() };

      // missing employeeId
      let res = await request(app).post('/updateEmpProfile').send({});
      expect(res.statusCode).toBe(400);

      // not found
      res = await request(app).post('/updateEmpProfile').send({ employeeId: 'no' });
      expect(res.statusCode).toBe(404);

      // success
      Employee.findByIdAndUpdate = jest.fn().mockResolvedValue(updated);
      res = await request(app).post('/updateEmpProfile').send({ employeeId: 'eid', firstName: 'F' });
      expect(res.statusCode).toBe(200);
    });
  });
});
