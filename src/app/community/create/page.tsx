"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateCommunityPayload } from "@/lib/validators/community";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

const Page = () => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const {loginToast} = useCustomToast();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateCommunityPayload = {
        name: input,
      };
      const { data } = await axios.post("/api/community", payload);

      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "community already exists.",
            description: "please choose a different name for you community",
            variant: 'destructive'
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: "invalid community name.",
            description: "please choose a different name for you community",
            variant: 'destructive'
          });
        }
        if (err.response?.status === 422) {
          return toast({
            title: "invalid community name.",
            description: "please choose a different name for you community",
            variant: 'destructive'
          });
        }

        if (err.response?.status === 401) {
          return loginToast()
        }

        toast({
          title: "There was an unknown error",
          description: "could not create community",
          variant: "destructive"
        })
      }
    },
    onSuccess: (data) => {
      router.push(`/community/${data}`)
    }
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">create a community</h1>
        </div>
        <hr className="bg-zinc-500 h-px" />
        <div>
          <p className="text-lg font-medium">name</p>
          <p className="text-xs pb-2">community names cannot be changed.</p>
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-5"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="subtle" onClick={() => router.back()}>
            {" "}
            cancel{" "}
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
          >
            {" "}
            create community{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Page;
