'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { registerSchema, RegisterSchema } from "@/lib/schemas";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserData, registerUser } from "@/lib/actions/UserActions";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const registerDefaultValues = {
  username: "",
  password: "",
  apiKey: "",
};

function RegisterPage() {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerDefaultValues,
  });

  const router = useRouter();


  const onSubmit = async (values: RegisterSchema) => {
    await registerUser(values);
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
          <CardTitle>Register</CardTitle>
          <CardDescription>It is always better to get a second opinion</CardDescription>
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

              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem className="w-full px-2">
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your API key"/>
                    </FormControl>
                  </FormItem>
                )}
              />

              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md py-2 px-4 w-1/2"
              >
                Register
              </button>

              <CardFooter>
                <CardDescription>
                  Already have an account?&nbsp;
                  <a href="/login" className="text-blue-500 hover:underline">Login</a>
                </CardDescription>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage;