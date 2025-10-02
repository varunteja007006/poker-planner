import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoomSchema } from "@/lib/validators";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useNavigate } from "react-router";
import { useUserStore } from "@/store/user.store";

type CreateRoomSchema = z.infer<typeof createRoomSchema>;

export default function CreateRoom({
  onSuccess,
}: Readonly<{
  onSuccess?: () => void;
}>) {
  const { userToken } = useUserStore();
  const navigate = useNavigate();

  const createRoomMutation = useMutation(api.rooms.createRoom);

  const form = useForm<CreateRoomSchema>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      roomName: "",
    },
  });

  const onSubmit = async (data: CreateRoomSchema) => {
    if (!userToken) {
      toast.error("Please register first.");
      return;
    }

    try {
      const result = await createRoomMutation({ 
        roomName: data.roomName, 
        userToken 
      });
      
      if (result.success) {
        toast.success(result.message);
        form.reset();
        onSuccess?.();
        navigate(`/room/${result.roomCode}`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to create room. Please try again.");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-sm lg:w-md space-y-2">
        <FormField
          control={form.control}
          name="roomName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">{`Room Name`}</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter room name"
                  className="flex-1"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !userToken}
          className="w-full cursor-pointer"
        >
          Create Room
        </Button>
      </form>
    </Form>
  );
}
