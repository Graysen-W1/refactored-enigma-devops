# Lunary 🌙 - App Idea
> one thought, one day, one moon.

  ## User Story                                                                                                     
                                              
  - As someone who gets caught up in the chaos of daily life, I want a simple place to write down one thing each day
  - Helps me slow down and reflect                         
                                                                                                                    
  ## What is Lunary?                                                                                                
                                                                                                                    
  - A minimalist daily journaling app with a space and moon theme
  - One entry per day, no more
  - Shows the current moon phase next to your writing area
  - Past entries are viewable                                                            
  
  ## Who is it for?                                                                                                 
                  
  - Anyone who wants to journal but gets overwhelmed by apps that try to do too much                                
  - Students, writers, or anyone wanting a quiet corner of the internet to put their thoughts down
  - Built for people who like simple, not busy                                                                      
                  
  ## What problem does it solve?                                                                                    
  
  - Most journaling apps try to be everything (habit trackers, mood charts, AI coaches, streak counters, etc.)      
  - Lunary does one thing: gives you a clean space to write one thing per day
  - The moon phase is just a gentle aesthetic anchor, not another feature fighting for your attention

**Initial Wireframe of App Idea:**
<img width="750" height="550" alt="app_inspo!" src="https://github.com/user-attachments/assets/4016faaa-1482-4d7c-9828-dc2c727e9674" />           
  
  ## Value Proposition                                                                                              
                  
  - **Before Lunary:** apps either feel way too sparse (like a plain text file) or way too busy (dashboards with 10 
  metrics and gamified streaks)
  - **After Lunary:** open the site, see the moon, see today's date, write your one thing, save. Done.
  - The limitation is kind of the whole point

## Capability Boxes  

### Selected = Pathway 1: The Clean Upgrade 🫧                                                                                             
  
  | Box | What I Did | Evidence | Notes |                                                                           
  |---|---|---|---|
  | 🏗 Architecture Refactor | I split the monolithic `app.mjs` into `/routes`, `/controllers`, `/models`, and `/middleware` so the structure actually scales. | [Milestone #2](https://github.com/Graysen-W1/lunary/milestone/2),                                    [Issue #4](https://github.com/Graysen-W1/lunary/issues/4), [Issue #5](https://github.com/Graysen-W1/lunary/issues/5) | The old `app.mjs` was a wall of code with everything shoved in one file. Breaking it up made every other milestone way easier. |
  | 🔥 Firebase Integration | I migrated from MongoDB to Firestore using the Firebase Admin SDK. | [Milestone #3](https://github.com/Graysen-W1/lunary/milestone/3), [Issue #8](https://github.com/Graysen-W1/lunary/issues/8), [Issue #9](https://github.com/Graysen-W1/lunary/issues/9) | Firestore queries work nothing like MongoDB, so I had to rewrite every database call from scratch. |                                                                    
  | 🔐 Auth System | I built JWT-based registration and login with bcrypt password hashing and middleware that protects all the entry routes. | [Milestone #4](https://github.com/Graysen-W1/lunary/milestone/4), [Issue #6](https://github.com/Graysen-W1/lunary/issues/6), [Issue #7](https://github.com/Graysen-W1/lunary/issues/7) | Sending the JWT with every AJAX request using `$.ajaxSetup()` was way cleaner than attaching headers manually every time. |   
  | ✨ UI/UX Overhaul | I added a Bootstrap 5 navbar and a logout button, plus a decorative space cat, rocket, and star SVGs to make the app feel more alive. | [Milestone #5](https://github.com/Graysen-W1/lunary/milestone/5), [Issue #10](https://github.com/Graysen-W1/lunary/issues/10), [Issue #11](https://github.com/Graysen-W1/lunary/issues/11) | Learned the hard way that flex centering on the body will push a navbar to the middle of the screen. `.auth-wrapper` saved me. |
  | 🔍 Search Feature | I added a search bar in the navbar that filters entries through a new `/api/entries/search` endpoint and reuses the Past Entries modal for results. | [Milestone #6](https://github.com/Graysen-W1/lunary/milestone/6), [Issue #15](https://github.com/Graysen-W1/lunary/issues/15), [Issue #16](https://github.com/Graysen-W1/lunary/issues/16) | Firestore has no full-text search, so I just pull entries and filter with `.includes()`. |
  | 📖 Deployment Guide | I wrote up the full GCP + Nginx + PM2 + Let's Encrypt setup and the GitHub Actions CI/CD pipeline in the repo Wiki. | [Wiki: Deployment Guide](https://github.com/Graysen-W1/lunary/wiki/Deployment-Guide), [Milestone #7](https://github.com/Graysen-W1/lunary/milestone/7) | Wiki format worked better than stuffing it into a markdown file. The Debug Case Study lives next to it. |                                                    
  | 🐛 Debug Case Study | I wrote up a production outage where OOM killed my Node app on an undersized VM, including how I investigated and fixed it. | [Wiki: Debug Case Study](https://github.com/Graysen-W1/lunary/wiki/Debug-Case-Study), [Milestone #8](https://github.com/Graysen-W1/lunary/milestone/8) | GCP's "Running" status does not mean the guest OS is healthy. Serial console logs were what actually told me what was happening. |
---

## Sprint 99
[working on it now lol]

## Deployment

- **Production:** https://lunary.barrycumbie.com/
- **Development:** https://dev-refactored-enigma-devops.onrender.com/

### Thanks for stopping by, I hope Lunary is helpful to you! 🌙
