import mongoose from 'mongoose';
import ExperienceSession from '../models/experienceSession.model.js';
import ExperienceCard from '../models/experienceCard.model.js';
import User from '../models/user.model.js';
import Center from '../models/center.model.js';

const seedExperienceData = async () => {
  try {
    console.log('🌱 Starting to seed experience data...');

    // Get a center and admin user
    const center = await Center.findOne();
    if (!center) {
      console.error('❌ No center found. Please create a center first.');
      return;
    }

    const admin = await User.findOne({ role: 'center_admin' });
    if (!admin) {
      // Try to find any user with admin or super_admin role
      const anyAdmin = await User.findOne({ $or: [{ role: 'admin' }, { role: 'super_admin' }] });
      if (anyAdmin) {
        // eslint-disable-next-line no-console
        console.log(`✅ Using admin: ${anyAdmin.name}`);
        const adminUser = anyAdmin;

        // eslint-disable-next-line no-console
        console.log(`✅ Using center: ${center.name}`);

        await seedDataWithUser(center, adminUser);
      } else {
        // eslint-disable-next-line no-console
        console.error('❌ No admin user found. Please create an admin user first.');
        return;
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(`✅ Using center: ${center.name}`);
      // eslint-disable-next-line no-console
      console.log(`✅ Using admin: ${admin.name}`);

      await seedDataWithUser(center, admin);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error seeding experience data:', error);
  }
};

const seedDataWithUser = async (center, admin) => {
  // Clear existing data
  await ExperienceSession.deleteMany({});
  await ExperienceCard.deleteMany({});
  // eslint-disable-next-line no-console
  console.log('🧹 Cleared existing experience data');

  // Create upcoming sessions
  const upcomingSessions = [
    {
      title: 'My Journey from Student to Entrepreneur',
      description:
        'Join me as I share my experience of starting a tech company while still in university. Learn about the challenges, victories, and lessons learned along the way.',
      date: '2025-11-15',
      time: '14:00',
      tag: 'Entrepreneurship',
      centerId: center._id,
      createdBy: admin._id,
    },
    {
      title: 'رحلتي في تعلم البرمجة - My Coding Journey',
      description:
        'سأشارك معكم تجربتي في تعلم البرمجة من الصفر وكيف أصبحت مطور برامج محترف. I will share my experience learning programming from scratch and becoming a professional developer.',
      date: '2025-11-20',
      time: '16:00',
      tag: 'Technology',
      centerId: center._id,
      createdBy: admin._id,
    },
    {
      title: 'Breaking Into the Design Industry',
      description:
        'A candid discussion about my path to becoming a UX/UI designer, the skills that matter most, and how to build a strong portfolio.',
      date: '2025-11-25',
      time: '15:00',
      tag: 'Design',
      centerId: center._id,
      createdBy: admin._id,
    },
    {
      title: 'تجربتي في العمل عن بعد - Remote Work Experience',
      description:
        'كيف نجحت في بناء مسيرة مهنية ناجحة من خلال العمل عن بعد مع شركات عالمية. How I built a successful career working remotely with international companies.',
      date: '2025-12-01',
      time: '10:00',
      tag: 'Career',
      centerId: center._id,
      createdBy: admin._id,
    },
    {
      title: 'Leadership Lessons from Youth Projects',
      description:
        'Sharing valuable leadership insights gained from managing youth-led community projects and social initiatives.',
      date: '2025-12-05',
      time: '14:30',
      tag: 'Leadership',
      centerId: center._id,
      createdBy: admin._id,
    },
  ];

  const createdSessions = await ExperienceSession.insertMany(upcomingSessions);
  // eslint-disable-next-line no-console
  console.log(`✅ Created ${createdSessions.length} upcoming sessions`);

  // Create past sessions (for archived tab)
  const pastSessions = [
    {
      title: 'Overcoming Public Speaking Anxiety',
      description:
        "I used to be terrified of speaking in front of people. Here's how I overcame that fear and became a confident presenter.",
      date: '2025-10-15',
      time: '14:00',
      tag: 'Personal Growth',
      centerId: center._id,
      createdBy: admin._id,
    },
    {
      title: 'كيف نجحت في الحصول على منحة دراسية - Scholarship Success',
      description:
        'شاركت تجربتي الكاملة في التقديم للمنحات الدراسية والنصائح التي ساعدتني في النجاح. Shared my complete experience in applying for scholarships and tips that helped me succeed.',
      date: '2025-10-08',
      time: '16:00',
      tag: 'Education',
      centerId: center._id,
      createdBy: admin._id,
    },
    {
      title: 'From Freelancing to Full-Time: My Transition',
      description:
        'The ups and downs of transitioning from freelance work to a full-time position, and what I wish I knew earlier.',
      date: '2025-09-28',
      time: '15:00',
      tag: 'Career',
      centerId: center._id,
      createdBy: admin._id,
    },
  ];

  const createdPastSessions = await ExperienceSession.insertMany(pastSessions);
  // eslint-disable-next-line no-console
  console.log(`✅ Created ${createdPastSessions.length} past sessions`);

  // Create experience cards linked to some sessions
  const experienceCards = [
    {
      title: 'Overcoming Public Speaking Anxiety',
      summary:
        'My journey from being terrified of public speaking to confidently presenting to large audiences. I learned that fear is natural, but practice and preparation are the keys to success. Start small, join speaking clubs, and gradually challenge yourself with bigger audiences.',
      lessons: [
        'Start with small groups and gradually increase audience size',
        'Practice makes perfect - rehearse your speeches multiple times',
        'Focus on your message, not on yourself',
        'Use breathing techniques to manage anxiety',
        'Remember that the audience wants you to succeed',
      ],
      tag: 'Personal Growth',
      centerId: center._id,
      sessionId: createdPastSessions[0]._id,
      createdBy: admin._id,
    },
    {
      title: 'كيف نجحت في الحصول على منحة دراسية',
      summary:
        'رحلتي للحصول على منحة دراسية كاملة للدراسة في الخارج. تعلمت أن التحضير المبكر والبحث الجيد والصدق في الطلب هي مفاتيح النجاح. My journey to receiving a full scholarship to study abroad taught me that early preparation, thorough research, and authenticity are keys to success.',
      lessons: [
        'ابدأ البحث عن المنح مبكراً - Start searching for scholarships early',
        'اكتب رسالة تحفيزية صادقة وشخصية - Write an honest and personal motivation letter',
        'احصل على توصيات قوية من أساتذتك - Get strong recommendations from your professors',
        'قدم على عدة منح لزيادة فرصك - Apply to multiple scholarships to increase your chances',
        'استعد جيداً للمقابلات - Prepare well for interviews',
      ],
      tag: 'Education',
      centerId: center._id,
      sessionId: createdPastSessions[1]._id,
      createdBy: admin._id,
    },
    {
      title: 'From Freelancing to Full-Time Career',
      summary:
        'Transitioning from freelance work to a full-time position was both exciting and challenging. I learned the importance of financial planning, building professional relationships, and understanding the value of stability versus flexibility.',
      lessons: [
        'Build an emergency fund before making the transition',
        'Network actively - many full-time positions come from connections',
        'Evaluate benefits beyond salary (healthcare, retirement, etc.)',
        "Don't burn bridges with freelance clients - maintain relationships",
        'Be prepared for a cultural shift in work environment',
      ],
      tag: 'Career',
      centerId: center._id,
      sessionId: createdPastSessions[2]._id,
      createdBy: admin._id,
    },
    {
      title: 'Building My First Mobile App',
      summary:
        'The story of how I went from knowing nothing about mobile development to launching my first app on the App Store. It took months of learning, many failed attempts, and countless debugging sessions, but the achievement was worth every struggle.',
      lessons: [
        'Choose the right framework for your needs (React Native, Flutter, Native)',
        'Start with a simple MVP and iterate based on feedback',
        'User experience is more important than fancy features',
        'Testing on real devices is crucial',
        'The App Store approval process requires patience and attention to detail',
      ],
      tag: 'Technology',
      centerId: center._id,
      sessionId: null,
      createdBy: admin._id,
    },
    {
      title: 'تجربتي في تأسيس مشروع اجتماعي - Social Enterprise Journey',
      summary:
        'كيف بدأت مشروعاً اجتماعياً لمساعدة الشباب في مجتمعي. تعلمت أن التأثير الاجتماعي يتطلب التزاماً طويل الأمد وفهماً عميقاً لاحتياجات المجتمع. How I started a social project to help youth in my community and learned that social impact requires long-term commitment.',
      lessons: [
        "افهم احتياجات مجتمعك بعمق - Deeply understand your community's needs",
        'ابدأ صغيراً واختبر فكرتك - Start small and test your idea',
        'بناء شراكات قوية أمر أساسي - Building strong partnerships is essential',
        'قس تأثيرك بطرق ملموسة - Measure your impact in tangible ways',
        'الاستدامة المالية مهمة للاستمرار - Financial sustainability is important for continuity',
      ],
      tag: 'Entrepreneurship',
      centerId: center._id,
      sessionId: null,
      createdBy: admin._id,
    },
  ];

  const createdCards = await ExperienceCard.insertMany(experienceCards);
  // eslint-disable-next-line no-console
  console.log(`✅ Created ${createdCards.length} experience cards`);

  // eslint-disable-next-line no-console
  console.log('\n🎉 Experience data seeding completed successfully!');
  // eslint-disable-next-line no-console
  console.log(`📊 Summary:`);
  // eslint-disable-next-line no-console
  console.log(`   - Upcoming Sessions: ${createdSessions.length}`);
  // eslint-disable-next-line no-console
  console.log(`   - Past Sessions: ${createdPastSessions.length}`);
  // eslint-disable-next-line no-console
  console.log(`   - Experience Cards: ${createdCards.length}`);
};

export default seedExperienceData;
