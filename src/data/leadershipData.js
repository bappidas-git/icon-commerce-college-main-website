/* ============================================
   leadershipData.js — "From the Desk of …"
   Icon Commerce College
   --------------------------------------------
   Pure data module. The 7 desk-holders from design-system §6, in the
   canonical order (President → Advisor → Principal → Rector →
   Director (Academic) → Director → Academic Advisor).

   The `message` field is the full "From the Desk of …" copy transcribed from
   the official prospectus (Prompt 37), lightly edited for clarity, as an array
   of paragraphs. The Leadership page renders each paragraph inside the desk's
   blockquote; the Home LeadershipTeaser carries its own short teaser excerpts.
   Photos are labelled placeholders (design-system §7).
   ============================================ */

import { placeholder } from '../utils/assets';

/**
 * @typedef {Object} Leader
 * @property {string} name
 * @property {string} role
 * @property {string} [qualifications]
 * @property {string} image       Placeholder URL
 * @property {string[]} message   Full prospectus copy, one string per paragraph
 * @property {boolean} [featured]  President / Principal highlighted
 */

/** @type {Leader[]} */
export const leadershipData = [
  {
    name: 'Smt. Dipali Bora',
    role: 'President, Governing Body',
    qualifications: '',
    image: placeholder('president-dipali-bora'),
    featured: true,
    message: [
      'Dear Aspirants, greetings, blessings and thanks for your interest in Icon Commerce College.',
      'Icon Commerce College was a humble and sincere effort by a few academicians in the year 2004 to impart quality higher education in a large locality, and over the years we have heartily witnessed a tremendous growth of the institution. It has transformed into a progressive, equal-opportunity institution that has become the vanguard of academic excellence.',
      'My best wishes to all prospective students, and my regards to the parents for having bestowed their faith in us. I strongly hope that all students who join the Icon Commerce College fraternity will take it to still greater heights.',
    ],
  },
  {
    name: 'Sri Debasish Bora',
    role: 'Advisor',
    qualifications: '',
    image: placeholder('advisor-debasish-bora'),
    message: [
      'I welcome each and every student to this portal of learning, “Icon Commerce College”. As the saying goes, “An investment in knowledge pays the best interest”.',
      'Education plays a pivotal role in helping us evolve as better individuals. It goes beyond providing the skills and knowledge of a particular subject at hand, and inculcates within us the ability to develop well-informed opinions of the world that we live in. Recognising this, Icon Commerce College provides our students with ample opportunities for growth as they strive to achieve their individual goals.',
      'The college has carved a name for itself in the academic scenario and made exemplary strides since its inception in 2004. With the strong mentoring of our highly motivated and dedicated teaching faculty, and the backing of an efficient support staff, we envisage that each of our students carves out a unique niche for themselves in their chosen fields of interest.',
      'Our college has maintained a composite and syncretic culture through these years, with an immense diversity of students across cultures from the entire North Eastern Region who have been a part of this institution.',
      'As you embark on your journey into a new phase of life — towards your goals and dreams, ready to explore your world and spread your wings to fly high — a nurturing, learner-centric and progressive environment awaits you here. I wish you a happy journey into our learning methodologies.',
    ],
  },
  {
    name: 'Dr. Mandira Saha',
    role: 'Principal',
    qualifications: 'M.Com., M.Phil., Ph.D.',
    image: placeholder('principal-dr-mandira-saha'),
    featured: true,
    message: [
      'Icon Commerce College aims to create an atmosphere of excellence, hard work and professionalism in all its undertakings. It is committed to fulfilling students’ aspirations, building their self-esteem and developing their personality. Students are nurtured to grow in honesty, confidence, creativity, discipline and enthusiasm. The college provides the best exposure and opportunities to its students, with a curriculum designed to ensure that every student realises their potential.',
      'In achieving our goals, we are fortunate to have a team of committed and expert teaching and support staff who ensure that the learning environment for our students is the best it can be. Our teaching and learning methods, with the right blend of theory and practice, take students towards industry readiness and global excellence. We believe in the capacity of every student to grow and excel in their field, as everyone is gifted with different talents and infinite potential. We seek to instil in our students a passion for learning and the understanding required to make a positive contribution to society.',
      'I am confident that, with the support of the management, staff and students, we will continue to grow, prosper and reach new heights. I assure you that no stone will be left unturned in helping you realise your cherished goals. We warmly welcome you all to Icon Commerce College.',
    ],
  },
  {
    name: 'Sri Sawpon Dowerah',
    role: 'Rector',
    qualifications: '',
    image: placeholder('rector-sawpon-dowerah'),
    message: [
      'The publication of a new college prospectus heralds the beginning of another academic session. It is an indication of a process of continuity and growth of the college, making us more keenly aware than ever before of the new challenges before us. The new prospectus can be seen as a reaffirmation of our commitment towards providing quality education to our new students.',
      'I hope the teachers take this opportunity to rededicate themselves to the noble cause of fulfilling the hopes and aspirations of the new entrants, and enriching their lives with the strength to face the challenges of life.',
    ],
  },
  {
    name: 'Rajib Kumar Das',
    role: 'Director (Academic)',
    qualifications: '',
    image: placeholder('director-academic-rajib-das'),
    message: [
      'It is with great pride and pleasure that I welcome you to Icon Commerce College — a place where knowledge meets character and learning goes beyond textbooks. At Icon Commerce College, we are committed to nurturing young minds, fostering innovation and building a strong foundation for the leaders of tomorrow. Our institution stands on the pillars of academic excellence, holistic development and moral integrity. With a team of dedicated educators, modern infrastructure and a student-centric approach, we strive to create an environment that is intellectually stimulating, emotionally supportive and socially enriching.',
      'We believe education is not just about acquiring information, but about developing the ability to think critically, act responsibly and grow continuously. Every initiative we take is guided by our vision to empower students with the skills and values necessary to thrive in the modern world.',
      'I invite you to be a part of this vibrant learning community and to join us on a journey of growth, exploration and success. Together, let us shape a future where education is a lifelong inspiration.',
    ],
  },
  {
    name: 'Smt. Dipanju Bora',
    role: 'Director',
    qualifications: '',
    image: placeholder('director-dipanju-bora'),
    message: [
      'Welcome to Icon Commerce College, where ambition meets opportunity and learning becomes a lifelong journey.',
      'In today’s fast-evolving world, education is not just about acquiring knowledge — it is about building character, nurturing vision and preparing oneself to face challenges with confidence. At our institution, we are committed to creating a progressive and student-centric environment that enables every learner to grow academically, professionally and personally.',
      'Since our establishment in 2004, the college has continuously strengthened its academic standards and administrative practices to ensure a seamless and enriching experience for students. Our administrative framework is designed to be efficient, transparent and supportive, allowing students to focus on what truly matters — their growth and success.',
      'What truly defines our institution is its vibrant and inclusive community. Students from diverse cultural backgrounds across the North Eastern Region come together here, creating a rich environment of shared learning, mutual respect and collaboration.',
      'As you take this significant step toward your future, remember that success is shaped by dedication, discipline and the willingness to learn. We are here to support you at every stage of your journey and to help you transform your aspirations into achievements. Step forward with confidence, explore your potential and make the most of every opportunity that lies ahead. Wishing you a purposeful and rewarding journey.',
    ],
  },
  {
    name: 'Dr. Nilanjan Bhattacharjee',
    role: 'Academic Advisor',
    qualifications: 'M.Com., M.B.A., Ph.D.',
    image: placeholder('academic-advisor-nilanjan-bhattacharjee'),
    message: [
      'Dear students, in the enduring task of society’s development and nation-building, fostering ideas and encouraging innovation are the two primary instruments of the day. Icon Commerce College (affiliated to Gauhati University) is the place where you will find a modest combination of both.',
      'Icon Commerce College is one of the excellent learning centres in North East India, imparting multidisciplinary courses. The main objective of the education system is to incorporate the right values among students to produce socially sensitive citizens, and our institution is persistently motivated towards the holistic development of students using an outcome-based curriculum blended with co-curricular and extra-curricular activities, led by a dedicated team of faculty. Since inception, we have marked ourselves in repute by providing a high pass percentage along with securing ranks in the merit list of Gauhati University.',
      'We welcome you all to Icon Commerce College.',
    ],
  },
];

export default leadershipData;
