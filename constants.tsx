import { Course, PromotionalContent, SubscriptionPlan, User, UserRole } from './types';

export const MOCK_USER_STUDENT: User = {
  id: 1,
  name: 'أحمد المصري',
  role: UserRole.STUDENT,
  plan: SubscriptionPlan.STANDARD,
  points: 480,
  rank: 125,
};

export const MOCK_USER_TEACHER: User = {
  id: 101,
  name: 'أستاذ علي',
  role: UserRole.TEACHER,
};

export const MOCK_USER_ADMIN: User = {
  id: 999,
  name: 'المدير',
  role: UserRole.ADMIN,
};

export const MOCK_COURSES: Course[] = [
  { id: 'py101', title: 'أساسيات بايثون', description: 'ابدأ رحلتك في عالم البرمجة مع لغة بايثون السهلة والممتعة.', type: 'نظري', instructor: 'أ. محمد عبدالله', imageUrl: 'https://picsum.photos/seed/python/400/200' },
  { id: 'js201', title: 'جافاسكريبت للمبتدئين', description: 'تعلم لغة الويب الأساسية لبناء مواقع تفاعلية وديناميكية.', type: 'نظري', instructor: 'أ. فاطمة الزهراء', imageUrl: 'https://picsum.photos/seed/js/400/200' },
  { id: 'web301', title: 'ورشة عمل HTML & CSS', description: 'جلسة عملية لبناء صفحة ويب كاملة من الصفر.', type: 'تطبيقي', instructor: 'أ. علي حسن', imageUrl: 'https://picsum.photos/seed/html/400/200' },
  { id: 'react401', title: 'مقدمة في React', description: 'اكتشف عالم بناء واجهات المستخدم الحديثة مع مكتبة React.', type: 'تطبيقي', instructor: 'أ. سارة إبراهيم', imageUrl: 'https://picsum.photos/seed/react/400/200' },
];

export const MOCK_INITIAL_PROMO_CONTENT: PromotionalContent = {
  mainVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // A placeholder video
  galleryImages: [
    'https://picsum.photos/seed/promo1/800/400',
    'https://picsum.photos/seed/promo2/800/400',
    'https://picsum.photos/seed/promo3/800/400',
  ],
  specialOffers: [
    'عرض خاص: خصم 20% على باقة VIP عند الاشتراك السنوي!',
  ],
};


export const PRICING_PLANS = {
    [SubscriptionPlan.BASIC]: {
        name: 'الباقة الأساسية (Basic)',
        price: 40,
        features: ['الوصول للكورسات النظرية', 'تبديل الكورس مرة واحدة', 'حد أقصى 30 طالب في الكورس التطبيقي'],
        borderColor: 'border-sky-500',
        buttonColor: 'bg-sky-500 hover:bg-sky-600',
    },
    [SubscriptionPlan.STANDARD]: {
        name: 'الباقة المتقدمة (Standard)',
        price: 70,
        features: ['كل مميزات الباقة الأساسية', 'تبديل الكورس مرتين', 'حد أقصى 15 طالب في الكورس التطبيقي', 'مساعد ذكي أسرع'],
        borderColor: 'border-indigo-500',
        buttonColor: 'bg-indigo-500 hover:bg-indigo-600',
    },
    [SubscriptionPlan.VIP]: {
        name: 'الباقة المميزة (VIP)',
        price: 100,
        features: ['كل مميزات الباقة المتقدمة', 'تبديل الكورس 5 مرات', 'حد أقصى 10 طلاب في الكورس التطبيقي', 'جلسات مراجعة خاصة', 'شهادة مميزة'],
        borderColor: 'border-amber-500',
        buttonColor: 'bg-amber-500 hover:bg-amber-600',
    }
};

export const ICONS = {
    user: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
    teacher: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="m11 16 3-3 3 3"/></svg>,
    admin: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    robot: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>,
    close: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    send: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
    graduationCap: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
    rocket: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.12-.67-1.02-1.9-1.63-3.05-2.02a7.86 7.86 0 0 0-2.55-.33c-1.22.03-2.3.43-3.1.95.8-.65 1.88-1.05 3.1-1.05.65 0 1.28.13 1.88.35L14 8l4.45-3.56c.86-.68 1.95-.74 2.88-.15.93.59 1.43 1.7 1.22 2.76-.21 1.06-.92 1.92-1.88 2.22L18 10l-1.35 4.88c.12.6.28 1.18.5 1.72.78 1.9 2.3 3.68 3.85 4.4.65.3 1.05.95 1 1.65-.05.7-.55 1.3-1.25 1.55-.7.25-1.45.05-2-
.45-1.5-1.25-2.8-3-3.65-4.78-.2-.42-.35-.88-.45-1.35L5.5 16.5Z"/></svg>,
    code: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    arrowLeft: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    gamepad: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.01.15v5.52c0 .05.004.1.01.15A4 4 0 0 0 6.68 18h10.64a4 4 0 0 0 3.99-3.59c.006-.05.01-.1.01-.15V8.74c0-.05-.004-.1-.01-.15A4 4 0 0 0 17.32 5z"/></svg>,
    palette: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.667 0-.424-.163-.82-.437-1.125-.29-.317-.437-.656-.437-1.028v-1.11c0-.889.39-1.74 1.08-2.315.83-.7 1.83-1.025 2.83-1.025s2 .325 2.83 1.025c.69.575 1.08 1.426 1.08 2.315v1.11c0 .372-.147.71-.437 1.028-.274.304-.437.7-.437 1.125C22.352 21.254 23.074 22 24 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>,
    music: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    swords: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14.5 17.5 4-4"/><path d="m20.5 19.5-4.5-4.5"/><path d="m14.5 7.5 4 4"/><path d="m20.5 5.5-4.5 4.5"/><path d="m3.5 14.5 4 4"/><path d="m9.5 12.5-4.5 4.5"/><path d="M3.5 9.5 7.5 13.5"/><path d="m9.5 2.5-4.5 4.5"/></svg>,
    play: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
    arrowUp: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>,
    arrowDown: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>,
    arrowRight3D: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
    arrowLeft3D: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
};

export const GAMEDEV_ZONES = [
    {
        id: 'programming_camp',
        name: 'معسكر البرمجة',
        icon: ICONS.code,
        position: { x: 0, y: 0, z: -200 },
        isLocked: false,
        description: 'ابدأ رحلتك هنا لتعلم أساسيات المنطق البرمجي وكيفية إصدار الأوامر.',
        challenge: {
            id: 'challenge_1',
            title: 'التحدي الأول: قل مرحباً!',
            description: 'مهمتك هي جعل شخصيتك تتحدث. اسحب بلوك "Speak" إلى منطقة العمل واكتب رسالتك.',
            toolbox: [{ id: 'block_speak', type: 'Speak', content: 'Speak(...)' }],
            workspaceSlots: 1,
            solution: { blockType: 'Speak', value: 'أهلاً بالعالم!' },
            reward: 50, // XP points
        },
    },
     {
        id: 'graphics_workshop',
        name: 'ورشة الجرافيك',
        icon: ICONS.palette,
        position: { x: 250, y: 0, z: -400 },
        isLocked: true,
        unlockLevel: 2,
        description: 'تعلم كيف تصمم شخصيات وعوالم مذهلة. (مقفلة حتى تصل للمستوى 2)',
    },
    // More zones can be added here with 3D positions
];