import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useParams } from "next/navigation";
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
import { useCreateStory } from "@/api/stories/query";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1).max(100, {
    message: "Title must be between 1 and 100 characters",
  }),
  description: z.string().min(1).max(255, {
    message: "Description must be between 1 and 255 characters",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function AddUserStory() {
  const params = useParams();
  const roomCode = params.roomCode as string | undefined;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const createStory = useCreateStory();

  const onSubmit = (data: FormSchema) => {
    console.log(data);

    if (!roomCode) {
      toast.error("Room code not found");
      return;
    }

    createStory.mutate(
      {
        title: data.title,
        description: data.description,
        room_code: roomCode,
      },
      {
        onSuccess: (response) => {
          toast.success("Story created successfully");
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to create story");
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  className="bg-white"
                  {...field}
                  placeholder="Eg: Fixing issue 🐛"
                />
              </FormControl>
              <FormDescription>Title of the user story</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  className="bg-white"
                  {...field}
                  placeholder="Eg: Users logout often."
                />
              </FormControl>
              <FormDescription>Description of the user story</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="cursor-pointer w-full"
          variant={"secondary"}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
