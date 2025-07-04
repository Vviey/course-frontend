import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { ThemeContainer, ThemeCard, ThemeHeading, GradientButton } from '@/components/ui/theme';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { UserIdRecovery } from '@/components/ui/user-id-recovery';

// Login form schema
const loginFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

// Signup form schema
const signupFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

// Login Form Component
function LoginForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      login(data.username, data.password);
      setLocation('/home');
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in",
      });
    } catch (error) {
      console.error("Login failed", error);
      toast({
        title: "Login failed",
        description: "Please check your username and password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeCard className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center space-x-4 mb-4">
          <img 
            src="https://bitcoiners.africa/wp-content/uploads/2025/06/asha2.png" 
            alt="Asha" 
            className="h-24 object-contain"
          />
          <img 
            src="/assets/characters/odu.svg" 
            alt="Odu" 
            className="h-24 object-contain"
          />
        </div>
        <ThemeHeading className="mb-2">Continue Your Journey</ThemeHeading>
        <p className="text-lightText/80">Return to Asha's world of discovery</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2">Your Username</label>
          <input 
            type="text" 
            id="username" 
            {...register('username')}
            className="w-full bg-darkBg border border-secondary/40 rounded-md p-3 text-lightText focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
          <input 
            type="password" 
            id="password" 
            {...register('password')}
            className="w-full bg-darkBg border border-secondary/40 rounded-md p-3 text-lightText focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
            placeholder="Your journey password"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>
        
        <div className="pt-2">
          <GradientButton type="submit" disabled={loading}>
            Return to the Realms
          </GradientButton>
        </div>
        
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setLocation('/forgot-password')}
            className="text-secondary/80 hover:text-primary text-xs underline"
          >
            Forgot your password?
          </button>
        </div>
      </form>
    </ThemeCard>
  );
}

// Signup Form Component
function SignupForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { register } = useAuth();
  
  const { register: registerField, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    
    try {
      register(data.username, data.password, data.email);
      
      // Get the user from local storage which should have been set by AuthContext
      const storedUser = localStorage.getItem('ashaJourneyUserData');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUserId(userData.userId);
          
          toast({
            title: "Account created!",
            description: "Your Bitcoin Quest journey begins",
          });
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          setLoading(false);
          toast({
            title: "Something went wrong",
            description: "Could not retrieve your user ID",
            variant: "destructive"
          });
        }
      } else {
        setLoading(false);
        toast({
          title: "Something went wrong",
          description: "Could not retrieve your user ID",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setLoading(false);
      toast({
        title: "Registration failed",
        description: "Please try again with a different username",
        variant: "destructive"
      });
    }
  };

  const continueToApp = () => {
    setLocation('/home');
  };

  return (
    <>
      {userId ? (
        // Show user ID and instructions after successful signup
        <ThemeCard className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl text-primary">✓</span>
            </div>
            <ThemeHeading className="mb-2">Journey Begins!</ThemeHeading>
            <p className="text-lightText/80 mb-6">Your account has been created successfully</p>
          </div>
          
          <UserIdRecovery 
            userId={userId || ''}
            onClose={continueToApp}
          />
        </ThemeCard>
      ) : (
        // Show signup form
        <ThemeCard className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-4 mb-4">
              <img 
                src="https://bitcoiners.africa/wp-content/uploads/2025/06/asha2.png" 
                alt="Asha" 
                className="h-24 object-contain"
              />
              <img 
                src="/assets/characters/odu.svg" 
                alt="Odu" 
                className="h-24 object-contain"
              />
            </div>
            <ThemeHeading className="mb-2">Begin Your Journey</ThemeHeading>
            <p className="text-lightText/80">Create an account to track your progress</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">Username</label>
              <input 
                type="text" 
                id="username" 
                {...registerField('username')}
                className="w-full bg-darkBg border border-secondary/40 rounded-md p-3 text-lightText focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email <span className="text-xs text-lightText/60">(Optional)</span>
              </label>
              <input 
                type="email" 
                id="email" 
                {...registerField('email')}
                className="w-full bg-darkBg border border-secondary/40 rounded-md p-3 text-lightText focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                placeholder="Your email address"
              />
              <p className="mt-1 text-xs text-lightText/60">For password recovery (recommended)</p>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                {...registerField('password')}
                className="w-full bg-darkBg border border-secondary/40 rounded-md p-3 text-lightText focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                placeholder="Create a secure password"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                {...registerField('confirmPassword')}
                className="w-full bg-darkBg border border-secondary/40 rounded-md p-3 text-lightText focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="pt-2">
              <GradientButton type="submit" disabled={loading}>
                Start Your Journey
              </GradientButton>
            </div>
          </form>
        </ThemeCard>
      )}
    </>
  );
}

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      setLocation('/home');
    }
  }, [user, setLocation]);

  return (
    <ThemeContainer>
      <div className="min-h-screen flex flex-col p-4 sm:p-6">
        {/* Header with back button */}
        <header className="w-full max-w-6xl mx-auto mb-4">
          <button 
            onClick={() => setLocation('/')} 
            className="flex items-center text-secondary hover:text-primary"
          >
            <span className="mr-1">←</span> Back to Story
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column - Authentication form */}
            <div className="w-full">
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="login">Log In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>
                <TabsContent value="signup">
                  <SignupForm />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right column - Hero section */}
            <div className="hidden md:flex flex-col justify-center items-center">
              <div className="bg-darkBg/40 p-8 rounded-2xl border border-primary/20 backdrop-blur-sm">
                <div className="flex justify-center mb-8">
                  <img 
                    src="/https://bitcoiners.africa/wp-content/uploads/2025/06/asha2.png" 
                    alt="Asha" 
                    className="h-64 object-contain"
                  />
                </div>
                <ThemeHeading className="mb-4 text-center">Explore the World of Bitcoin with Asha</ThemeHeading>
                <p className="text-lightText/80 text-center mb-6">
                  Embark on an educational journey through the realms of Bitcoin and discover the 
                  revolutionary potential of this technology in Africa and beyond.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-lightText/90">
                    <span className="text-primary mr-2">✓</span> Interactive learning through stories
                  </li>
                  <li className="flex items-center text-lightText/90">
                    <span className="text-primary mr-2">✓</span> Earn badges and track your progress
                  </li>
                  <li className="flex items-center text-lightText/90">
                    <span className="text-primary mr-2">✓</span> Explore 7 unique realms of Bitcoin knowledge
                  </li>
                  <li className="flex items-center text-lightText/90">
                    <span className="text-primary mr-2">✓</span> Learn at your own pace, on any device
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeContainer>
  );
}