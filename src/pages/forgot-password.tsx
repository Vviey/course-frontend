import { useState } from 'react';
import { useLocation } from 'wouter';
import { ThemeContainer, ThemeCard, ThemeHeading, GradientButton } from '@/components/ui/theme';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Please enter a valid email').optional(),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      username: '',
      email: '',
    }
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setLoading(true);
    
    // Since this is a demo application, we'll simulate the forgot password process
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        title: "Password Reset Instructions Sent",
        description: "Check your email for password reset instructions",
      });
    }, 2000);
  };

  if (submitted) {
    return (
      <ThemeContainer>
        <ThemeCard className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-4 mb-4">
              <img 
                src="/assets/characters/asha.svg" 
                alt="Asha" 
                className="h-24 object-contain"
              />
              <img 
                src="/assets/characters/odu.svg" 
                alt="Odu" 
                className="h-24 object-contain"
              />
            </div>
            <ThemeHeading className="mb-2">Check Your Email</ThemeHeading>
            <p className="text-lightText/80 mb-6">
              We've sent password reset instructions to your email address.
            </p>
          </div>
          
          <div className="space-y-4">
            <GradientButton onClick={() => setLocation('/auth')}>
              Return to Login
            </GradientButton>
            
            <button
              onClick={() => {
                setSubmitted(false);
                setLoading(false);
              }}
              className="w-full text-secondary/80 hover:text-primary text-sm underline"
            >
              Didn't receive email? Try again
            </button>
          </div>
        </ThemeCard>
      </ThemeContainer>
    );
  }

  return (
    <ThemeContainer>
      <ThemeCard className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={() => setLocation('/auth')}
            className="inline-flex items-center text-secondary/80 hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </button>
          
          <div className="flex justify-center space-x-4 mb-4">
            <img 
              src="/assets/characters/asha.svg" 
              alt="Asha" 
              className="h-24 object-contain"
            />
            <img 
              src="/assets/characters/odu.svg" 
              alt="Odu" 
              className="h-24 object-contain"
            />
          </div>
          <ThemeHeading className="mb-2">Forgot Your Password?</ThemeHeading>
          <p className="text-lightText/80">
            Enter your username and we'll help you get back to your Bitcoin journey
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">Username</label>
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
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email (Optional)</label>
            <input 
              type="email" 
              id="email" 
              {...register('email')}
              className="w-full bg-darkBg border border-secondary/40 rounded-md p-3 text-lightText focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>
          
          <div className="pt-2">
            <GradientButton type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </GradientButton>
          </div>
        </form>
      </ThemeCard>
    </ThemeContainer>
  );
}