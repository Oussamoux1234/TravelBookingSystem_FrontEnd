import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { Chrome, AlertTriangle } from 'lucide-react';

import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const signUpSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type SignInFormValues = z.infer<typeof signInSchema>;

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const {
    register: registerSignIn,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSignUp = async (data: SignUpFormValues) => {
    if (!isFirebaseConfigured) {
      toast({ variant: 'destructive', title: 'Firebase not configured', description: 'Please configure Firebase to enable authentication.' });
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth as any, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.name });
      navigate('/profile');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sign-up failed', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignIn = async (data: SignInFormValues) => {
    if (!isFirebaseConfigured) {
      toast({ variant: 'destructive', title: 'Firebase not configured', description: 'Please configure Firebase to enable authentication.' });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth as any, data.email, data.password);
      navigate('/profile');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sign-in failed', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured || !googleProvider) {
      toast({ variant: 'destructive', title: 'Firebase not configured', description: 'Please configure Firebase to enable authentication.' });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithPopup(auth as any, googleProvider);
      navigate('/profile');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Google sign-in failed', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Show warning if Firebase is not configured
  if (!isFirebaseConfigured) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="font-headline">Authentication</CardTitle>
          <CardDescription>Sign in to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Firebase Not Configured</AlertTitle>
            <AlertDescription>
              Authentication is disabled because Firebase credentials are not set up.
              To enable authentication, create a <code className="text-xs bg-muted px-1 py-0.5 rounded">.env</code> file
              with your Firebase credentials.
            </AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Required environment variables:</p>
            <ul className="list-disc list-inside text-xs space-y-1 bg-muted p-3 rounded">
              <li>VITE_FIREBASE_API_KEY</li>
              <li>VITE_FIREBASE_AUTH_DOMAIN</li>
              <li>VITE_FIREBASE_PROJECT_ID</li>
              <li>VITE_FIREBASE_STORAGE_BUCKET</li>
              <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
              <li>VITE_FIREBASE_APP_ID</li>
            </ul>
          </div>
          <Button asChild className="w-full">
            <Link to="/">Go to Homepage</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs defaultValue="signin" className="w-full">
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="signin">
            <CardHeader className="px-1">
              <CardTitle className="font-headline">Welcome Back</CardTitle>
              <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignInSubmit(onSignIn)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input id="signin-email" type="email" placeholder="m@example.com" {...registerSignIn('email')} />
                {signInErrors.email && <p className="text-sm text-destructive">{signInErrors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input id="signin-password" type="password" {...registerSignIn('password')} />
                {signInErrors.password && <p className="text-sm text-destructive">{signInErrors.password.message}</p>}
              </div>
              <Button disabled={isLoading} className="w-full">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <CardHeader className="px-1">
              <CardTitle className="font-headline">Create an Account</CardTitle>
              <CardDescription>Enter your information to create a new account.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignUpSubmit(onSignUp)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input id="signup-name" placeholder="John Doe" {...registerSignUp('name')} />
                {signUpErrors.name && <p className="text-sm text-destructive">{signUpErrors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="m@example.com" {...registerSignUp('email')} />
                {signUpErrors.email && <p className="text-sm text-destructive">{signUpErrors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" {...registerSignUp('password')} />
                {signUpErrors.password && <p className="text-sm text-destructive">{signUpErrors.password.message}</p>}
              </div>
              <Button disabled={isLoading} className="w-full">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>
        </CardContent>
      </Tabs>
    </Card>
  );
}
