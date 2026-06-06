/* ============================================
   testimonialsData.js — Alumni testimonials
   Icon Commerce College
   --------------------------------------------
   Pure data module. All 11 alumni voices from the official prospectus
   (design-system §6), lightly edited for length and clarity for the carousel
   card format. No fabricated names, roles or quotes.
   ============================================ */

import { placeholder } from '../utils/assets';

const AVATAR = placeholder('testimonial-avatar');

/**
 * @typedef {Object} Testimonial
 * @property {string} name
 * @property {string} role     Role / current affiliation
 * @property {string} quote
 * @property {string} avatar   Placeholder URL
 */

/** @type {Testimonial[]} */
export const testimonialsData = [
  {
    name: 'Raghav Sarma',
    role: 'Advocate, Gauhati High Court',
    quote:
      'Icon Commerce College has always believed in helping and guiding its students. Regular classes and the continuous efforts of our teachers helped us in our comprehensive development — we were encouraged and guided at each step, which helped us excel in our careers.',
    avatar: AVATAR,
  },
  {
    name: 'Devika Adhyapak',
    role: 'Administrative Assistant, IIT Guwahati',
    quote:
      'I am proud and blessed to be a part of this college, as it taught me many life lessons and to be disciplined in my studies and career. The teachers here are the best — friendly and motivating — and I thank every staff member for making our college life memorable.',
    avatar: AVATAR,
  },
  {
    name: 'Akash Paul',
    role: 'Assistant Professor, Biswanath College',
    quote:
      'My experience at Icon Commerce College has been truly exceptional. The knowledgeable faculty imparted invaluable insights, while the student-centric approach and emphasis on practical, industry-relevant skills shaped me into a confident, well-rounded individual ready for the professional world.',
    avatar: AVATAR,
  },
  {
    name: 'Dishangka Jiten Pathak',
    role: 'Jr. Accounts Asst. Trainee, IOCL',
    quote:
      'Icon Commerce College gave me an excellent learning experience that equipped me with the skills and knowledge to succeed. The faculty were dedicated to student success, and the focus on practical, hands-on learning ensured I was well-prepared for the workplace. I recommend ICC to anyone looking for a quality business education.',
    avatar: AVATAR,
  },
  {
    name: 'Pritam Saha',
    role: 'Sr. Business Development Manager, SBI General',
    quote:
      'I will be forever indebted to Icon Commerce College for some of my fondest memories. The comprehensive classes and extra-curricular activities helped me become a confident and better person, and the well-built infrastructure made for a comfortable learning environment. I lived some of the best moments of my life here.',
    avatar: AVATAR,
  },
  {
    name: 'Bikash Bezbaruah',
    role: 'Manager, IDFC First Bank',
    quote:
      'I feel immensely happy and proud to have been a student of the Arts stream at Icon Commerce College, where I nurtured many pleasant memories. I fondly remember the teaching staff and hold them in the highest regard — it is because of their dedication that I and many of my friends secured excellent placements.',
    avatar: AVATAR,
  },
  {
    name: 'Banani Bhagawati',
    role: 'PGT English, Directorate of Secondary Education',
    quote:
      'I was a student of Icon Commerce College under the Arts stream, and I feel very lucky to have graduated from here. Through the experience I gained, I was able to step confidently into my future career. What I am today, I owe a lot to my respected teachers, who have been such an inspiration to me.',
    avatar: AVATAR,
  },
  {
    name: 'Ayushi Surana',
    role: 'BBA Alumna',
    quote:
      'The distinct attention and dedicated care the faculty give to each student is highly admirable. I studied BBA under some of the brilliant minds of the region, and they encouraged me to explore my talent and potential in an exceptional, integrated learning environment. I am grateful to be part of such an institution.',
    avatar: AVATAR,
  },
  {
    name: 'Ankita Kumari Agarwal',
    role: 'BBA Alumna',
    quote:
      'When I left school I was excited, nervous and scared to present myself before new faces — but Icon Commerce College welcomed me with open arms and made me feel like a family member. The faculty were wonderful and approachable, always there to help, not just with careers but with personal advice too. What I am today is, in large part, because of ICC.',
    avatar: AVATAR,
  },
  {
    name: 'Shahid Ansari',
    role: 'Entrepreneur',
    quote:
      'The graduation programme at Icon Commerce College helped me build the confidence and personality to face the challenges of the business world. Regular classes, projects and academic activities stretched our abilities and prepared us for a competitive world. The professors’ support and encouragement were the best of everything.',
    avatar: AVATAR,
  },
  {
    name: 'Tulika Devi',
    role: 'Graduate Teacher, Rangmahal High School',
    quote:
      'My experience at Icon Commerce College is great and memorable. The mentors helped us enhance our academic and interpersonal skills. I am thankful to our teachers for providing a platform to develop my skills and the opportunity to showcase them.',
    avatar: AVATAR,
  },
];

export default testimonialsData;
