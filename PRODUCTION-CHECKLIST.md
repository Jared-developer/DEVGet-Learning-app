# Production Deployment Checklist

Use this checklist to ensure everything is ready for production deployment.

## Pre-Deployment

### Database Setup
- [ ] Supabase project created
- [ ] All SQL schema files executed in correct order
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] Database indexes created for performance
- [ ] Test data removed (if any)
- [ ] Admin user created and tested

### Environment Variables

#### Backend
- [ ] `NODE_ENV=production`
- [ ] `PORT` configured
- [ ] `SUPABASE_URL` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (keep secret!)
- [ ] `SUPABASE_ANON_KEY` set
- [ ] `JWT_SECRET` generated (strong, unique)
- [ ] `JWT_EXPIRES_IN` configured
- [ ] `FRONTEND_URL` set to production domain
- [ ] `EMAIL_HOST` configured
- [ ] `EMAIL_PORT` configured
- [ ] `EMAIL_USER` configured
- [ ] `EMAIL_PASS` configured (use app-specific password)
- [ ] Rate limiting variables set

#### Frontend
- [ ] `VITE_SUPABASE_URL` set
- [ ] `VITE_SUPABASE_ANON_KEY` set
- [ ] `VITE_API_URL` set to backend URL

### Code Review
- [ ] All console.logs removed or replaced with proper logging
- [ ] No hardcoded credentials in code
- [ ] Error handling implemented
- [ ] Input validation in place
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers enabled (helmet.js)

### Testing
- [ ] All features tested locally
- [ ] Authentication flow tested
- [ ] Course enrollment tested
- [ ] Assignment submission tested
- [ ] Certificate generation tested
- [ ] Admin functions tested
- [ ] Mobile responsiveness checked
- [ ] Cross-browser testing done

## Deployment

### Backend Deployment
- [ ] Hosting platform selected (Render/Railway/Heroku)
- [ ] Repository connected
- [ ] Build command configured
- [ ] Start command configured
- [ ] Environment variables added
- [ ] Health check endpoint working
- [ ] Backend URL noted and saved

### Frontend Deployment
- [ ] Hosting platform selected (Vercel/Netlify)
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Redirects configured for SPA routing
- [ ] Frontend URL noted and saved

### Domain Configuration (Optional)
- [ ] Custom domain purchased
- [ ] DNS records configured
- [ ] SSL certificate active (usually automatic)
- [ ] Domain verified and working

## Post-Deployment

### Verification
- [ ] Frontend loads without errors
- [ ] Backend health check responds: `/health`
- [ ] User registration works
- [ ] User login works
- [ ] Course pages load
- [ ] API calls succeed
- [ ] Images and assets load
- [ ] No CORS errors in console
- [ ] No 404 errors for routes

### Data Population
- [ ] Initial courses added
- [ ] Instructors added
- [ ] Course content populated
- [ ] Announcements created (if any)
- [ ] Test assignments created

### Security
- [ ] HTTPS enabled (should be automatic)
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] RLS policies verified in Supabase
- [ ] Service role key never exposed to frontend
- [ ] Admin access restricted
- [ ] Email credentials secured

### Monitoring Setup
- [ ] Error tracking configured (optional: Sentry)
- [ ] Uptime monitoring set up (optional: UptimeRobot)
- [ ] Database usage monitored in Supabase
- [ ] Server logs accessible
- [ ] Performance monitoring enabled

### Documentation
- [ ] Deployment details documented
- [ ] Environment variables documented
- [ ] Admin credentials stored securely
- [ ] API endpoints documented
- [ ] Backup procedures documented

## Performance Optimization

- [ ] Frontend build optimized (check bundle size)
- [ ] Images optimized and compressed
- [ ] Lazy loading implemented where appropriate
- [ ] Database queries optimized
- [ ] Caching headers configured
- [ ] CDN configured (if needed)

## Backup & Recovery

- [ ] Database backup strategy in place (Supabase auto-backups)
- [ ] Environment variables backed up securely
- [ ] Recovery procedure documented
- [ ] Rollback plan prepared

## Communication

- [ ] Team notified of deployment
- [ ] Users notified (if applicable)
- [ ] Support channels ready
- [ ] Maintenance window communicated (if any)

## Post-Launch Monitoring (First 24-48 Hours)

- [ ] Monitor error logs hourly
- [ ] Check server performance
- [ ] Monitor database connections
- [ ] Watch for authentication issues
- [ ] Track user registrations
- [ ] Monitor API response times
- [ ] Check email delivery
- [ ] Review user feedback

## Week 1 Tasks

- [ ] Review all error logs
- [ ] Analyze user behavior
- [ ] Check database performance
- [ ] Review security logs
- [ ] Optimize slow queries
- [ ] Address user feedback
- [ ] Update documentation as needed

## Ongoing Maintenance

- [ ] Weekly log reviews
- [ ] Monthly dependency updates
- [ ] Quarterly security audits
- [ ] Regular database backups verification
- [ ] Performance monitoring
- [ ] User feedback collection

---

## Emergency Contacts

**Hosting Support:**
- Backend: _______________
- Frontend: _______________

**Database:**
- Supabase Support: support@supabase.io

**Team Contacts:**
- Lead Developer: _______________
- DevOps: _______________
- Admin: _______________

---

## Rollback Procedure

If critical issues occur:

1. **Immediate Actions:**
   - Check error logs
   - Verify environment variables
   - Check Supabase status

2. **Frontend Rollback:**
   - Vercel: Revert to previous deployment in dashboard
   - Netlify: Rollback in deployments section

3. **Backend Rollback:**
   - Render: Redeploy previous version
   - Railway: Rollback in deployments
   - Heroku: `heroku rollback`

4. **Database Rollback:**
   - Restore from Supabase backup
   - Contact Supabase support if needed

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Version:** _______________
**Status:** _______________
