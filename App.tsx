import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, UserRole, Course, PromotionalContent, ChatMessage, SubscriptionPlan } from './types';
import { MOCK_USER_STUDENT, MOCK_USER_TEACHER, MOCK_USER_ADMIN, MOCK_COURSES, MOCK_INITIAL_PROMO_CONTENT, PRICING_PLANS, ICONS, GAMEDEV_ZONES } from './constants';
import { getAiCodeHelp, getAiPlatformHelp } from './services/geminiService';

// --- SHARED UI COMPONENTS --- //

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}
const Card: React.FC<CardProps> = ({ children, className = '', style, onClick }) => (
  <div onClick={onClick} style={style} className={`relative bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl shadow-lg overflow-hidden group transition-all duration-300 hover:border-sky-500/80 hover:shadow-2xl hover:shadow-sky-600/10 ${className}`}>
     <div className="absolute -inset-px bg-gradient-to-r from-sky-500 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-lg"></div>
    <div className="relative">
      {children}
    </div>
  </div>
);


interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}
const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', variant = 'primary', type = 'button', disabled = false }) => {
  const baseClasses = 'px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-950 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    primary: 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 focus:ring-sky-500/50 text-white shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/30',
    secondary: 'bg-slate-800 hover:bg-slate-700 focus:ring-slate-600/50 text-slate-200 border border-slate-700',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500/50 text-white',
  };
  return <button onClick={onClick} type={type} className={`${baseClasses} ${variantClasses[variant]} ${className}`} disabled={disabled}>{children}</button>;
};

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}
const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange, placeholder, required = true }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
    <input 
      type={type} 
      value={value}
      onChange={onChange}
      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white transition-all focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-slate-700/50" 
      placeholder={placeholder} 
      required={required} 
    />
  </div>
);

// --- HEADER COMPONENT --- //
const Header: React.FC<{ currentUser: User | null; onLogout: () => void; }> = ({ currentUser, onLogout }) => {
  return (
    <header className="bg-slate-950/70 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-800/50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-white transition-transform hover:scale-105">
            {ICONS.graduationCap}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">اتعلم البرمجة</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-slate-300 hover:text-sky-400 font-medium transition-colors">الرئيسية</Link>
          <a href="/#pricing" className="text-slate-300 hover:text-sky-400 font-medium transition-colors">الكورسات والباقات</a>
          <Link to="#" className="text-slate-300 hover:text-sky-400 font-medium transition-colors">عن المنصة</Link>
          <Link to="#" className="text-slate-300 hover:text-sky-400 font-medium transition-colors">تواصل معنا</Link>
        </div>
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3 text-slate-200">
              <span className="font-medium">مرحباً, {currentUser.name}</span>
              {currentUser.role === UserRole.STUDENT && <Link to="/dashboard/student" className="p-2 rounded-full hover:bg-slate-800 transition-colors">{ICONS.user}</Link>}
              {currentUser.role === UserRole.TEACHER && <Link to="/dashboard/teacher" className="p-2 rounded-full hover:bg-slate-800 transition-colors">{ICONS.teacher}</Link>}
              {currentUser.role === UserRole.ADMIN && <Link to="/dashboard/admin" className="p-2 rounded-full hover:bg-slate-800 transition-colors">{ICONS.admin}</Link>}
              <button onClick={onLogout} title="تسجيل الخروج" className="p-2 rounded-full hover:bg-red-500/20 text-red-400 transition-colors">{ICONS.logout}</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
                <Link to="/login?role=student" className="px-5 py-2 rounded-lg text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors">تسجيل دخول</Link>
                <a href="#pricing" className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-90 transition-opacity">انضم الآن</a>
                <Link to="/login?role=teacher" className="hidden md:block text-slate-400 hover:text-white px-3 text-sm transition-colors">دخول المعلمين</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

// --- HOME PAGE --- //
const HomePage: React.FC = () => {
  return (
    <>
    <div className="pt-24 pb-20 text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Right Column - Text content */}
          <div className="md:order-last opacity-0 animate-fade-in-right">
            <div className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-400 text-sm font-bold px-4 py-2 rounded-full mb-5">
              {ICONS.rocket}
              <span>منصة تعليمية متقدمة</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              اتعلم البرمجة بنفسك
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mb-10" style={{ animationDelay: '0.2s' }}>
              انضم إلى آلاف الطلاب في رحلة تعلم البرمجة من خلال كورسات عملية، مساعد ذكي متطور، ونظام نقاط تفاعلي يجعل التعلم ممتعاً ومثمراً.
            </p>
            <div className="flex items-center gap-4" style={{ animationDelay: '0.4s' }}>
              <a href="#pricing" className="flex items-center gap-2 px-8 py-3.5 rounded-lg font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/30">
                <span>ابدأ التعلم الآن</span>
                {ICONS.arrowLeft}
              </a>
              <a href="#courses" className="px-8 py-3.5 rounded-lg font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors">
                تصفح الكورسات
              </a>
            </div>
            <div className="mt-16 flex flex-wrap gap-x-10 gap-y-6 text-center md:text-right opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div>
                <p className="text-4xl font-bold text-white">+500</p>
                <span className="text-slate-400">طالب نشط</span>
              </div>
              <div>
                <p className="text-4xl font-bold text-white" style={{ animationDelay: '0.7s' }}>+25</p>
                <span className="text-slate-400">كورس متاح</span>
              </div>
              <div>
                <p className="text-4xl font-bold text-white" style={{ animationDelay: '0.8s' }}>+15</p>
                <span className="text-slate-400">معلم خبير</span>
              </div>
               <div>
                <p className="text-4xl font-bold text-white" style={{ animationDelay: '0.9s' }}>95%</p>
                <span className="text-slate-400">نسبة رضا</span>
              </div>
            </div>
          </div>

          {/* Left Column - Visual element */}
          <div className="opacity-0 animate-fade-in-left">
             <Card className="min-h-[450px] !p-8 flex flex-col items-center justify-center text-center hover:!scale-100">
                 <div className="text-sky-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {React.cloneElement(ICONS.code, {width: 96, height: 96})}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">رحلة تعلم البرمجة تبدأ هنا</h3>
                  <p className="text-slate-400 max-w-sm">
                    اكتشف قوة البرمجة مع معلمين خبراء ومساعد ذكي متطور
                  </p>
             </Card>
          </div>
        </div>
      </div>
    </div>

     {/* --- COURSES AND PRICING SECTIONS (COMBINED) --- */}
    <div className="py-24 opacity-0 animate-fade-in-up">
        <div className="container mx-auto px-6">
            {/* Pricing Section */}
            <div id="pricing" className="text-center">
                <h2 className="text-4xl font-bold text-white mb-4">اختر الباقة التي تناسبك</h2>
                <p className="text-lg text-slate-400 mb-16 max-w-3xl mx-auto">ابدأ رحلتك التعليمية بالباقة المثالية. كل باقة مصممة لتمنحك أفضل الأدوات التي تحتاجها للنجاح والتفوق.</p>
                <div className="grid md:grid-cols-3 gap-8 text-right">
                    {Object.entries(PRICING_PLANS).map(([planKey, plan], index) => {
                        const isFeatured = plan.name.includes('Standard');
                        return (
                            <div key={plan.name} className={`relative opacity-0 animate-fade-in-up rounded-xl p-8 flex flex-col bg-slate-900 border border-slate-800 transition-all duration-300 hover:border-sky-500/50 hover:-translate-y-2 ${isFeatured ? 'border-sky-500 shadow-2xl shadow-sky-500/10' : ''}`} style={{ animationDelay: `${index * 150}ms` }}>
                                {isFeatured && <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-sky-500 text-white text-xs font-bold px-4 py-1 rounded-full">الأكثر شيوعاً</div>}
                                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                                <p className="mt-4 text-4xl font-extrabold text-white">{plan.price} <span className="text-base font-medium text-slate-400">جنيه/شهرياً</span></p>
                                <ul className="mt-6 space-y-3 text-slate-300 flex-grow">
                                    {plan.features.map(feature => (
                                        <li key={feature} className="flex items-start">
                                            <svg className="w-6 h-6 text-green-500 ml-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link to={`/register?plan=${planKey}`}>
                                  <Button className="mt-8 w-full !py-3" variant={isFeatured ? 'primary' : 'secondary'}>
                                      اشترك الآن
                                  </Button>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Courses Section */}
            <div id="courses" className="mt-28 text-center">
                <h2 className="text-4xl font-bold text-white mb-4">استكشف كورساتنا المتاحة</h2>
                 <p className="text-lg text-slate-400 mb-16 max-w-3xl mx-auto">بعد اختيار باقتك، يمكنك التسجيل في أي من هذه الكورسات المصممة بعناية لتناسب كل المستويات، من المبتدئين إلى المتقدمين.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-right">
                    {MOCK_COURSES.map((course, index) => (
                        <div key={course.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                            <Card className="flex flex-col text-right h-full !p-0 hover:!scale-105">
                                <img className="w-full h-40 object-cover rounded-t-xl" src={course.imageUrl} alt={course.title} />
                                <div className="p-5 flex flex-col flex-grow">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full self-start ${course.type === 'تطبيقي' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-sky-500/20 text-sky-300'}`}>
                                    {course.type}
                                </span>
                                <h3 className="text-xl font-bold mt-3 text-white">{course.title}</h3>
                                <p className="text-slate-400 mt-2 flex-grow">{course.description}</p>
                                <div className="mt-5 border-t border-slate-700/50 pt-4 flex justify-between items-center">
                                    <span className="text-sm text-slate-400">المدرس: {course.instructor}</span>
                                    <Button onClick={() => {}} variant="secondary" className="!px-4 !py-1.5 !text-sm">سجل الآن</Button>
                                </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    </>
  );
};

// --- REGISTRATION PAGE --- //
const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  
  const selectedPlanKey = searchParams.get('plan') as SubscriptionPlan || SubscriptionPlan.BASIC;
  const planDetails = PRICING_PLANS[selectedPlanKey];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("كلمتا المرور غير متطابقتين!");
      return;
    }
    const newUser = { fullName, email, password, age, plan: selectedPlanKey };
    localStorage.setItem('registered_student_account', JSON.stringify(newUser));
    navigate('/payment');
  };

  return (
    <div className="flex items-center justify-center py-20 opacity-0 animate-fade-in-up">
      <div className="w-full max-w-lg mx-auto">
        <Card className="!p-10">
          <h2 className="text-3xl font-bold text-white text-center mb-2">إنشاء حساب جديد</h2>
          {planDetails && <p className="text-center text-slate-400 mb-6">للاشتراك في <span className="font-bold text-sky-400">{planDetails.name}</span></p>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField label="الاسم بالكامل" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="مثال: محمد أحمد" />
            <InputField label="البريد الإلكتروني" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" />
            <InputField label="كلمة المرور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <InputField label="تأكيد كلمة المرور" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
            <InputField label="السن" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="ادخل عمرك" />
            <Button type="submit" className="w-full !py-3 !text-base mt-4">المتابعة للدفع</Button>
          </form>
          <p className="text-center text-slate-400 mt-6">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="font-semibold text-sky-400 hover:text-sky-300 transition-colors">
              تسجيل الدخول
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

// --- LOGIN PAGE --- //
const LoginPage: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialRole = searchParams.get('role') === 'teacher' ? UserRole.TEACHER : UserRole.STUDENT;
    
    const [activeRole, setActiveRole] = useState<UserRole>(initialRole);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        setActiveRole(initialRole);
    }, [initialRole]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (activeRole === UserRole.STUDENT) {
            const storedUserStr = localStorage.getItem('registered_student_account');
            if (storedUserStr) {
                const registeredUser = JSON.parse(storedUserStr);
                if (registeredUser.email === username && registeredUser.password === password) {
                    const studentUser: User = {
                        id: MOCK_USER_STUDENT.id,
                        role: UserRole.STUDENT,
                        points: MOCK_USER_STUDENT.points,
                        rank: MOCK_USER_STUDENT.rank,
                        name: registeredUser.fullName,
                        plan: registeredUser.plan || SubscriptionPlan.BASIC,
                    };
                    onLogin(studentUser);
                    navigate('/dashboard/student');
                } else {
                    alert('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
                }
            } else {
                alert('لم يتم العثور على حساب طالب. يرجى إنشاء حساب أولاً.');
            }
        } else if (activeRole === UserRole.TEACHER) {
            // Mock login for teacher
            onLogin(MOCK_USER_TEACHER);
            navigate('/dashboard/teacher');
        }
    };

    return (
        <div className="flex items-center justify-center py-20 opacity-0 animate-fade-in-up">
            <div className="w-full max-w-md mx-auto">
                 <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-sky-900/20 overflow-hidden">
                    <div className="flex">
                        <button 
                            onClick={() => setActiveRole(UserRole.STUDENT)} 
                            className={`flex-1 p-4 font-bold text-lg transition-all duration-300 rounded-tr-xl ${activeRole === UserRole.STUDENT ? 'bg-sky-600 text-white' : 'bg-transparent text-slate-300 hover:bg-slate-800'}`}
                        >
                            دخول طالب
                        </button>
                        <button 
                            onClick={() => setActiveRole(UserRole.TEACHER)} 
                            className={`flex-1 p-4 font-bold text-lg transition-all duration-300 rounded-tl-xl ${activeRole === UserRole.TEACHER ? 'bg-sky-600 text-white' : 'bg-transparent text-slate-300 hover:bg-slate-800'}`}
                        >
                            دخول معلم
                        </button>
                    </div>
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-white text-center mb-6">
                            مرحباً بك مجدداً!
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                             <InputField 
                                label="البريد الإلكتروني" 
                                type="email" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                placeholder="ادخل بريدك الإلكتروني" 
                            />
                            <InputField 
                                label="كلمة المرور" 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="ادخل كلمة المرور" 
                            />
                            <Button type="submit" className="w-full !py-3 !text-base">
                                تسجيل الدخول
                            </Button>
                        </form>
                         <p className="text-center text-slate-400 mt-6">
                            ليس لديك حساب؟{' '}
                            <Link to="/register" className="font-semibold text-sky-400 hover:text-sky-300 transition-colors">
                                أنشئ حساباً جديداً
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- PAYMENT PAGE --- //
const PaymentPage: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const registeredUserData = useMemo(() => {
        const storedUserStr = localStorage.getItem('registered_student_account');
        return storedUserStr ? JSON.parse(storedUserStr) : null;
    }, []);

    const planDetails = registeredUserData?.plan ? PRICING_PLANS[registeredUserData.plan as SubscriptionPlan] : null;

    useEffect(() => {
        if (!registeredUserData || !planDetails) {
            navigate('/register');
        }
    }, [registeredUserData, planDetails, navigate]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardName || !cardNumber || !expiry || !cvc) {
            alert('يرجى ملء جميع بيانات الدفع.');
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            alert('تم الدفع بنجاح! مرحباً بك في المنصة.');

            const studentUser: User = {
                id: MOCK_USER_STUDENT.id,
                role: UserRole.STUDENT,
                points: 0,
                rank: MOCK_USER_STUDENT.rank,
                name: registeredUserData.fullName,
                plan: registeredUserData.plan,
            };

            onLogin(studentUser);
            navigate('/dashboard/student');
            setIsProcessing(false);
        }, 2000);
    };

    if (!planDetails || !registeredUserData) {
        return null;
    }

    return (
        <div className="flex items-center justify-center py-20 opacity-0 animate-fade-in-up">
            <div className="w-full max-w-2xl mx-auto">
                <Card className="!p-10">
                    <h2 className="text-3xl font-bold text-white text-center mb-4">إتمام عملية الدفع</h2>
                    <p className="text-center text-slate-400 mb-8">أنت على وشك الاشتراك في <span className="font-bold text-sky-400">{planDetails.name}</span>.</p>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className={`rounded-xl p-6 flex flex-col bg-slate-800/50 border ${planDetails.borderColor}`}>
                             <h3 className="text-xl font-bold text-white">{planDetails.name}</h3>
                             <p className="mt-2 text-3xl font-extrabold text-white">{planDetails.price} <span className="text-base font-medium text-slate-400">جنيه/شهرياً</span></p>
                             <ul className="mt-4 space-y-2 text-slate-300 text-sm flex-grow">
                                {planDetails.features.map(feature => (
                                    <li key={feature} className="flex items-start">
                                        <svg className="w-5 h-5 text-green-500 ml-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <InputField label="الاسم على البطاقة" type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="محمد أحمد" />
                            <InputField label="رقم البطاقة" type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="•••• •••• •••• ••••" />
                            <div className="grid grid-cols-2 gap-4">
                               <InputField label="تاريخ الانتهاء" type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" />
                               <InputField label="CVC" type="text" value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="١٢٣" />
                            </div>
                            <Button type="submit" className="w-full !py-3 !text-base mt-2" disabled={isProcessing}>
                                {isProcessing ? 'جاري المعالجة...' : `ادفع الآن (${planDetails.price} جنيه)`}
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
};


// --- DASHBOARD PAGES --- //
const StudentDashboard: React.FC<{ user: User }> = ({ user }) => (
  <div className="container mx-auto px-6 py-12 opacity-0 animate-fade-in-up">
    <h1 className="text-3xl font-bold text-white mb-8">لوحة تحكم الطالب</h1>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Game Dev Academy Card */}
      <Link to="/dashboard/student/gamedev" className="md:col-span-2 lg:col-span-3 opacity-0 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
         <Card className="!p-0 overflow-hidden text-right hover:!scale-105">
            <div className="relative h-56">
                <img src="https://picsum.photos/seed/gamedev/800/200" alt="Game Development Academy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">أكاديمية تطوير الألعاب</h3>
                <p className="text-slate-400 mb-4">انطلق في مغامرة تفاعلية لتعلم برمجة وتصميم الألعاب من الصفر.</p>
                <Button variant="primary">ابدأ المغامرة</Button>
            </div>
        </Card>
      </Link>

      <Card className="p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h3 className="font-bold text-xl text-slate-200 mb-2">البيانات الشخصية</h3>
        <p className="text-slate-300">الاسم: {user.name}</p>
        <p className="text-slate-300">الباقة: {user.plan}</p>
      </Card>
      <Card className="p-6 opacity-0 animate-fade-in-up !border-sky-500" style={{ animationDelay: '200ms' }}>
        <h3 className="font-bold text-xl text-slate-200 mb-2">النقاط والترتيب</h3>
        <p className="text-5xl font-bold text-sky-400 my-2">{user.points} نقطة</p>
        <p className="text-slate-300">ترتيبك الحالي: <span className="font-bold">#{user.rank}</span></p>
      </Card>
      <Card className="p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <h3 className="font-bold text-xl text-slate-200 mb-2">الشهادات</h3>
        <p className="text-green-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 15 15 15 9"></polyline></svg>
            شهادة إتمام أساسيات بايثون
        </p>
      </Card>
    </div>
  </div>
);

const TeacherDashboard: React.FC<{ user: User }> = ({ user }) => (
  <div className="container mx-auto px-6 py-12 opacity-0 animate-fade-in-up">
    <h1 className="text-3xl font-bold text-white mb-8">لوحة تحكم المدرس</h1>
    <p className="text-lg text-slate-300">مرحباً بك أستاذ {user.name.split(' ')[1]}, هنا يمكنك إدارة حصصك وطلابك.</p>
    {/* Teacher specific components would go here */}
  </div>
);

const AdminDashboard: React.FC<{ promoContent: PromotionalContent; setPromoContent: React.Dispatch<React.SetStateAction<PromotionalContent>> }> = ({ promoContent, setPromoContent }) => {
    const [activeTab, setActiveTab] = useState('promo');
    const [videoUrl, setVideoUrl] = useState(promoContent.mainVideoUrl);
    const [gallery, setGallery] = useState(promoContent.galleryImages.join('\n'));
    const [offers, setOffers] = useState(promoContent.specialOffers.join('\n'));

    const handleSave = () => {
        setPromoContent({
            mainVideoUrl: videoUrl,
            galleryImages: gallery.split('\n').filter(url => url.trim() !== ''),
            specialOffers: offers.split('\n').filter(offer => offer.trim() !== ''),
        });
        alert('تم حفظ التغييرات بنجاح!');
    };
    
    const renderContent = () => {
        switch (activeTab) {
            case 'promo':
                return (
                    <div className="space-y-6 opacity-0 animate-fade-in-up">
                        <div>
                            <label className="block font-medium text-slate-300 mb-1">رابط الفيديو الدعائي الرئيسي (YouTube Embed)</label>
                            <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full p-2.5 border border-slate-700 bg-slate-800 text-white rounded-md focus:ring-sky-500 focus:border-sky-500"/>
                        </div>
                        <div>
                            <label className="block font-medium text-slate-300 mb-1">صور العرض/الجاليري (رابط لكل سطر)</label>
                            <textarea value={gallery} onChange={e => setGallery(e.target.value)} rows={5} className="w-full p-2.5 border border-slate-700 bg-slate-800 text-white rounded-md focus:ring-sky-500 focus:border-sky-500"></textarea>
                        </div>
                        <div>
                            <label className="block font-medium text-slate-300 mb-1">العروض الخاصة (عرض لكل سطر)</label>
                            <textarea value={offers} onChange={e => setOffers(e.target.value)} rows={3} className="w-full p-2.5 border border-slate-700 bg-slate-800 text-white rounded-md focus:ring-sky-500 focus:border-sky-500"></textarea>
                        </div>
                         <Button onClick={handleSave}>حفظ المحتوى الدعائي</Button>
                    </div>
                );
            case 'teachers': return <div className="opacity-0 animate-fade-in-up text-slate-300">إدارة المدرسين (إضافة/حذف)</div>;
            case 'courses': return <div className="opacity-0 animate-fade-in-up text-slate-300">إدارة الكورسات (إضافة/حذف)</div>;
            case 'payments': return <div className="opacity-0 animate-fade-in-up text-slate-300">إعدادات طرق الدفع</div>;
            default: return null;
        }
    };

    const tabs = [
        { key: 'promo', label: 'المحتوى الدعائي' },
        { key: 'teachers', label: 'المدرسين' },
        { key: 'courses', label: 'الكورسات' },
        { key: 'payments', label: 'طرق الدفع' },
    ];
    
    return (
        <div className="container mx-auto px-6 py-12 opacity-0 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-white mb-8">لوحة تحكم الأدمن</h1>
            <div className="flex border-b border-slate-700 mb-8">
                {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`py-3 px-5 font-semibold transition-colors duration-300 ${activeTab === tab.key ? 'border-b-2 border-sky-400 text-sky-400' : 'text-slate-400 hover:text-sky-400 border-b-2 border-transparent'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>
            {renderContent()}
        </div>
    );
};

// --- GAMEDEV ACADEMY SIMULATOR (3D BLOCK-BASED) --- //
const Block3D: React.FC<{ block: any; onDragStart: (e: React.DragEvent, block: any) => void }> = ({ block, onDragStart }) => (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, block)}
      className="relative w-40 h-16 gamedev-block-3d cursor-grab active:cursor-grabbing"
    >
        <div className="block-face block-top bg-sky-700"></div>
        <div className="block-face block-bottom bg-sky-700"></div>
        <div className="block-face block-left bg-sky-800"></div>
        <div className="block-face block-right bg-sky-800"></div>
        <div className="block-face block-back bg-sky-600"></div>
        <div className="block-face block-front bg-sky-600 flex items-center justify-center text-white font-bold p-3 rounded-md">
            {block.content}
        </div>
    </div>
);

const GameDevAcademyPage: React.FC<{ user: User }> = ({ user }) => {
    const [level, setLevel] = useState(1);
    const [xp, setXp] = useState(0);
    const [max_xp, setMaxXp] = useState(100);
    const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 0, rotY: 0 });
    const [activeChallengeZone, setActiveChallengeZone] = useState<any | null>(null);
    const [workspaceBlock, setWorkspaceBlock] = useState<any | null>(null);
    const [characterSpeech, setCharacterSpeech] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
    const [interactionPrompt, setInteractionPrompt] = useState<any | null>(null);

    const moveSpeed = 40;
    const rotSpeed = 20;

    const handleMovement = (direction: 'forward' | 'backward' | 'left' | 'right') => {
        const rad = (playerPosition.rotY * Math.PI) / 180;
        let newPos = { ...playerPosition };
        switch (direction) {
            case 'forward':
                newPos.x -= Math.sin(rad) * moveSpeed;
                newPos.z -= Math.cos(rad) * moveSpeed;
                break;
            case 'backward':
                 newPos.x += Math.sin(rad) * moveSpeed;
                 newPos.z += Math.cos(rad) * moveSpeed;
                break;
            case 'left':
                 newPos.rotY = (newPos.rotY - rotSpeed + 360) % 360;
                break;
            case 'right':
                newPos.rotY = (newPos.rotY + rotSpeed) % 360;
                break;
        }
        setPlayerPosition(newPos);
    };

    useEffect(() => {
        let closestZone = null;
        let minDistance = 100; // Interaction distance

        GAMEDEV_ZONES.forEach(zone => {
            const distance = Math.sqrt(
                Math.pow(playerPosition.x - zone.position.x, 2) +
                Math.pow(playerPosition.z - zone.position.z, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestZone = zone;
            }
        });
        setInteractionPrompt(closestZone);

    }, [playerPosition]);
    
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const blockData = JSON.parse(e.dataTransfer.getData('block'));
        setWorkspaceBlock(blockData);
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    
    const handleRunCode = () => {
        setCharacterSpeech('');
        setFeedback(null);
        if (!activeChallengeZone || !workspaceBlock) {
             setFeedback({ type: 'error', message: 'اسحب بلوك إلى منطقة العمل أولاً!' });
             return;
        }
        const challenge = activeChallengeZone.challenge;
        if (workspaceBlock.type === challenge.solution.blockType) {
            const newXp = xp + challenge.reward;
            setXp(newXp);
            setFeedback({ type: 'success', message: `رائع! لقد حصلت على ${challenge.reward} نقطة خبرة.` });
            setCharacterSpeech(challenge.solution.value);
             if (newXp >= max_xp) {
                setLevel(level + 1);
                setXp(newXp - max_xp);
                setMaxXp(max_xp + 50);
             }
             setTimeout(() => {
                setActiveChallengeZone(null);
                setWorkspaceBlock(null);
                setFeedback(null)
             }, 3000)
        } else {
             setFeedback({ type: 'error', message: 'هذا ليس البلوك الصحيح. حاول مرة أخرى!' });
        }
    };
    
    const renderChallengeModal = () => (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in-up">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl flex flex-col p-4 shadow-2xl shadow-sky-900/40">
                <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                    <h2 className="text-2xl font-bold text-white">{activeChallengeZone?.challenge.title}</h2>
                    <Button onClick={() => setActiveChallengeZone(null)} variant="secondary">{ICONS.close}</Button>
                </div>
                <div className="grid grid-cols-2 gap-4 flex-grow">
                    <div className="flex flex-col gap-4">
                         <div className="flex-1 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                             <h3 className="font-bold text-sky-400 mb-2">منطقة العمل</h3>
                             <div onDrop={handleDrop} onDragOver={handleDragOver} className="h-24 bg-slate-900/50 rounded border-2 border-dashed border-slate-600 flex items-center justify-center p-2">
                                {workspaceBlock ? <Block3D block={workspaceBlock} onDragStart={() => {}}/> : <p className="text-slate-500">اسحب البلوك إلى هنا</p>}
                             </div>
                        </div>
                         {feedback && (
                            <div className={`p-3 rounded-lg text-sm font-semibold animate-fade-in-up ${
                                feedback.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                                {feedback.message}
                            </div>
                        )}
                        <Button onClick={handleRunCode} disabled={!workspaceBlock} className="w-full !py-3 flex items-center justify-center gap-2">
                            {ICONS.play} <span>تشغيل</span>
                        </Button>
                    </div>
                    <div className="flex-1 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h3 className="font-bold text-sky-400 mb-2">صندوق الأدوات</h3>
                        <div className="flex gap-2">
                            {activeChallengeZone?.challenge.toolbox.map((block: any) => (
                                <Block3D key={block.id} block={block} onDragStart={(e, b) => e.dataTransfer.setData('block', JSON.stringify(b))} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="h-[calc(100vh-80px)] flex flex-col opacity-0 animate-fade-in-up overflow-hidden">
            <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 p-3 shrink-0 z-20">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${user.name}&scale=100`} alt="avatar" className="w-12 h-12 rounded-full border-2 border-sky-400"/>
                        <div>
                            <p className="font-bold text-white">{user.name}</p>
                            <p className="text-sm text-slate-400">المستوى: {level}</p>
                        </div>
                    </div>
                    <div className="w-1/3">
                         <div className="w-full bg-slate-700 rounded-full h-4">
                            <div className="bg-amber-400 h-4 rounded-full transition-all duration-500" style={{width: `${(xp/max_xp)*100}%`}}></div>
                        </div>
                        <p className="text-center text-xs text-amber-300 mt-1 font-bold">{xp} / {max_xp} XP</p>
                    </div>
                </div>
            </div>

            <div className="flex-grow relative gamedev-scene-container">
                <div className="gamedev-scene w-full h-full" style={{transform: `translateZ(500px) rotateX(60deg) rotateZ(-${playerPosition.rotY}deg) translateX(${-playerPosition.x}px) translateY(${playerPosition.z}px)`}}>
                    <div className="absolute w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 gamedev-floor"></div>
                    {/* Player */}
                    <div className="gamedev-player absolute w-16 h-16 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{transform: `translateZ(50px) rotateZ(${playerPosition.rotY}deg)`}}>
                         <img src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${user.name}&scale=150`} alt="avatar" className="w-16 h-16" style={{transform: `rotateX(-60deg)`}} />
                         {characterSpeech && (
                             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg whitespace-nowrap" style={{transform: 'rotateX(-60deg) translateZ(30px)'}}>
                                 {characterSpeech}
                             </div>
                         )}
                    </div>
                    {/* Zones */}
                    {GAMEDEV_ZONES.map(zone => {
                       const isLocked = zone.isLocked && level < (zone.unlockLevel || 99);
                       return (
                           <div key={zone.id} className="gamedev-object absolute w-24 h-24" style={{ transform: `translateX(${zone.position.x}px) translateY(${zone.position.z}px) translateZ(62px)`}}>
                               <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white ${isLocked ? 'bg-slate-700' : 'bg-sky-500/50 gamedev-challenge-obj'}`} style={{transform: 'rotateX(-60deg)'}}>
                                    {zone.icon}
                               </div>
                           </div>
                       )
                    })}
                </div>
            </div>

             <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2">
                 {interactionPrompt && <Button onClick={() => setActiveChallengeZone(interactionPrompt)} className="!px-4 !py-2 animate-pulse-ring">تفاعل</Button>}
                <div className="grid grid-cols-3 gap-2 w-40">
                    <div></div>
                    <Button onClick={() => handleMovement('forward')} className="!p-2 aspect-square">{ICONS.arrowUp}</Button>
                    <div></div>
                    <Button onClick={() => handleMovement('left')} className="!p-2 aspect-square">{ICONS.arrowLeft3D}</Button>
                    <Button onClick={() => handleMovement('backward')} className="!p-2 aspect-square">{ICONS.arrowDown}</Button>
                    <Button onClick={() => handleMovement('right')} className="!p-2 aspect-square">{ICONS.arrowRight3D}</Button>
                </div>
             </div>

             {activeChallengeZone && renderChallengeModal()}
        </div>
    );
};


// --- AI ASSISTANT COMPONENT --- //
const AiAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<'code' | 'platform'>('code');
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);
    
    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input, type: mode };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const history: { role: 'user' | 'model'; parts: { text: string }[] }[] = messages
                .filter(m => m.type === 'code')
                .map(m => ({
                    role: m.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: m.text }]
                }));
            
            const aiResponseText = mode === 'code' ? await getAiCodeHelp(input, history) : await getAiPlatformHelp(input);
            const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText, type: mode };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { sender: 'ai', text: 'حدث خطأ ما، يرجى المحاولة مرة أخرى.', type: mode };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 left-6 bg-gradient-to-br from-sky-500 to-indigo-600 text-white w-16 h-16 rounded-full shadow-lg hover:opacity-90 transition-all transform hover:scale-110 z-[100] animate-pulse-ring"
                aria-label="افتح المساعد الذكي"
            >
                 <div className="flex items-center justify-center h-full w-full">
                   {isOpen ? ICONS.close : ICONS.robot}
                </div>
            </button>
            {isOpen && (
                <div className="fixed bottom-24 left-6 w-96 h-[60vh] bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-[99] opacity-0 animate-fade-in-up overflow-hidden">
                    <header className="p-4 flex justify-between items-center border-b border-slate-700 shrink-0">
                        <h3 className="font-bold text-white">المساعد الذكي</h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">{ICONS.close}</button>
                    </header>
                     <div className="p-2 bg-slate-800/50 flex justify-center gap-2 shrink-0">
                        <button onClick={() => setMode('code')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === 'code' ? 'bg-sky-500 text-white' : 'bg-transparent text-slate-300 hover:bg-slate-700'}`}>مساعدة برمجية</button>
                        <button onClick={() => setMode('platform')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === 'platform' ? 'bg-indigo-500 text-white' : 'bg-transparent text-slate-300 hover:bg-slate-700'}`}>مساعدة بالمنصة</button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.filter(m => m.type === mode).map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2.5 text-white ${msg.sender === 'user' ? 'bg-gradient-to-br from-sky-600 to-indigo-600 rounded-br-lg' : 'bg-slate-700 rounded-bl-lg'}`}>
                                     <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-700 rounded-2xl rounded-bl-lg px-4 py-2.5 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                                </div>
                            </div>
                        )}
                         <div ref={messagesEndRef} />
                    </div>
                    <div className="p-3 border-t border-slate-700 flex shrink-0">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="اسأل عن أي شيء..."
                            className="flex-1 p-2.5 border border-slate-700 rounded-l-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-white bg-slate-800"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading} className="bg-sky-600 text-white px-4 rounded-r-lg hover:bg-sky-700 disabled:bg-slate-600 flex items-center justify-center">{ICONS.send}</button>
                    </div>
                </div>
            )}
        </>
    );
};

// --- PROTECTED ROUTE COMPONENT --- //
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  currentUser: User | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, currentUser }) => {
  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="text-center py-20 opacity-0 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white">غير مصرح لك بالدخول</h2>
        <p className="text-slate-300">يرجى تسجيل الدخول بالصلاحية المناسبة للوصول لهذه الصفحة.</p>
      </div>
    );
  }
  return <>{children}</>;
};

// --- MAIN APP COMPONENT --- //
function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [promoContent, setPromoContent] = useState<PromotionalContent>(MOCK_INITIAL_PROMO_CONTENT);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <HashRouter>
      <div className="min-h-screen text-slate-300">
        <Header currentUser={currentUser} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage onLogin={setCurrentUser} />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/payment" element={<PaymentPage onLogin={setCurrentUser} />} />
            <Route path="/dashboard/student" element={
                <ProtectedRoute allowedRoles={[UserRole.STUDENT]} currentUser={currentUser}>
                    {currentUser && <StudentDashboard user={currentUser} />}
                </ProtectedRoute>
            } />
            <Route path="/dashboard/student/gamedev" element={
                <ProtectedRoute allowedRoles={[UserRole.STUDENT]} currentUser={currentUser}>
                    {currentUser && <GameDevAcademyPage user={currentUser} />}
                </ProtectedRoute>
            } />
             <Route path="/dashboard/teacher" element={
                <ProtectedRoute allowedRoles={[UserRole.TEACHER]} currentUser={currentUser}>
                    {currentUser && <TeacherDashboard user={currentUser} />}
                </ProtectedRoute>
            } />
            <Route path="/dashboard/admin" element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]} currentUser={currentUser}>
                    <AdminDashboard promoContent={promoContent} setPromoContent={setPromoContent} />
                </ProtectedRoute>
            } />
          </Routes>
        </main>
        {currentUser && currentUser.role === UserRole.STUDENT && <AiAssistant />}
      </div>
    </HashRouter>
  );
}

export default App;
