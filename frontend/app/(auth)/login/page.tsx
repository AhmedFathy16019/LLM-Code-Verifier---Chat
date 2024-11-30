'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { loginSchema, LoginSchema } from "@/lib/schemas";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserData, loginUser } from "@/lib/actions/UserActions";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const loginDefaultValues = {
  username: "",
  password: "",
};

function LoginPage() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const router = useRouter();

  const onSubmit = async (values: LoginSchema) => {
    await loginUser(values);
    const userData = await getUserData();
    
    if (userData) {
      router.push("/");
    } else {
      // Display error message
    }
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Card className="w-1/2 max-w-md p-4">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>More Code More Confidence</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col space-y-4 justify-center items-center"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full px-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter a cool username"/>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full px-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Enter a secure password"/>
                    </FormControl>
                  </FormItem>
                )}
              />

              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md py-2 px-4 w-1/2"
              >
                Login
              </button>

              <CardFooter>
                <CardDescription>
                  Don&apos;t have an account?&nbsp;
                  <a href="/register" className="text-blue-500 hover:underline">Register</a>
                </CardDescription>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage;