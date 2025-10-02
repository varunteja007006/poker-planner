import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { SendHorizontal } from "lucide-react";

import { toast } from "sonner";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@/lib/validators";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useLocation, useNavigate, useParams } from "react-router";
import { useUserStore } from "@/store/user.store";

type CreateUserSchema = z.infer<typeof createUserSchema>;

export default function Registration({
  onSuccess,
}: Readonly<{
  onSuccess?: () => void;
}>) {
  const { handleSetUserToken, userToken } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const roomCode = params?.roomCode;

  const redirectFromHome = () => {
    if (location.pathname === "/") {
      navigate("/room");
    }
  };

  const createUserMutation = useMutation(api.user.createUser);

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateUserSchema) => {
    try {
      const res = await createUserMutation({ name: data.name, roomCode });
      if (res.token) {
        localStorage.setItem("userToken", res.token);
        handleSetUserToken(res.token);
      }
      toast.success("User registered successfully!");
      form.reset();
      onSuccess?.();
      redirectFromHome();
    } catch (error) {
      toast.error("Failed to register user. Please try again.");
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (userToken) {
      redirectFromHome();
    }
  }, [userToken]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-sm lg:w-md">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className="flex gap-4 items-center">
                  <Input
                    placeholder="Eg: John Doe"
                    className="flex-1"
                    {...field}
                  />
                  <Button
                    type="submit"
                    size={"icon"}
                    disabled={form.formState.isSubmitting}
                    className="cursor-pointer"
                  >
                    <SendHorizontal />
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
