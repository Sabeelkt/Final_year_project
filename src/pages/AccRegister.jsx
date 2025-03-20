import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Stepper from "@/components/Stepper";
import { LoadingButton } from "@/components/ui/loading-button";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [parent] = useAutoAnimate({});
  const [accReq, setAccReq] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [apiError, setApiError] = useState(null);
  const steps = ["Step 1", "Step 2"];
  const [emailId, setEmailId] = useState("");

  // Define the form schema based on whether it's an account request
  const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    subject: z.string().nonempty({ message: "Subject is required" }),
    message: z.string().nonempty({ message: "Message is required" }),
    team_name: accReq
      ? z
          .string()
          .nonempty({ message: "Team Name is required" })
          .min(3, { message: "Team Name must be at least 3 characters" })
      : z.string().optional(),
    password: accReq
      ? z.string().min(6, { message: "Password must be at least 6 characters" })
      : z.string().optional(),
    Nodal_Officer: accReq
      ? z.string().nonempty({ message: "Head name required" })
      : z.string().optional(),
    phone_number: z
      .string()
      .regex(/^\d{10}$/, {
        message: "Phone number must be 10 digits and only contain numbers",
      })
      .optional(),
    contact_number: z
      .string()
      .regex(/^\d{10}$/, {
        message: "Contact number must be 10 digits and only contain numbers",
      })
      .optional(),
  });
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema), // Enable the resolver for validation
    defaultValues: {
      email: "",
      subject: "",
      message: "",
      team_name: "",
      password: "",
      Nodal_Officer: "",
      phone_number: "",
      contact_number: "",
    },
  });

  // Handle the form submission
  async function onSubmit(values) {
    setSubmitLoading(true);
    setApiError(null);

    try {
      if (values.subject === "Account Request") {
        await handleAccountRequest(values);
      } else {
        await handleContact(values);
      }
    } catch (error) {
      setDone(false);
      setApiError("Your message could not be sent. Please try again later");
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  }
  // Call the API to send the account request
  const handleAccountRequest = async (values) => {
    try {
      // Show the loading dialog
      setLoading(true);
      setShowDialog(true);

      // Store the email for potential future use
      setEmailId(values.email);

      // Make the API call
      const response = await fetch(`http://localhost:5000/api/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          status: "pending",
          createdAt: new Date().toISOString(),
        }),
      });

      // First check if the response is OK
      if (response.ok) {
        try {
          // Try to parse the JSON
          const data = await response.json();
          setDone(true);
          setLoading(false);
          alert("Your account request has been sent successfully");
          form.reset();
        } catch (jsonError) {
          // If JSON parsing fails but response was OK, still treat as success
          setDone(true);
          setLoading(false);
          alert("Your account request has been sent successfully");
          form.reset();
        }
      } else {
        // Response not OK
        setDone(false);
        setLoading(false);

        try {
          // Try to parse error response as JSON
          const errorData = await response.json();
          setApiError(
            errorData.message ||
              "Account request failed. Please try again later."
          );
        } catch (jsonError) {
          // If JSON parsing fails, use status text
          setApiError(
            `Request failed with status: ${response.status} - ${response.statusText}`
          );
        }
      }
    } catch (error) {
      setDone(false);
      setLoading(false);
      setApiError(
        "An error occurred while processing your request: " + error.message
      );
      console.error(error);
    }
  };

  // Call the API to send a contact message
  const handleContact = async (values) => {
    try {
      setLoading(true);
      setShowDialog(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        setDone(true);
        setLoading(false);
        alert("Your message has been sent successfully");
        form.reset();
      } else {
        setDone(false);
        setLoading(false);
        const data = await response.json();
        setApiError(
          data.message || "Message not sent. Please try again later."
        );
      }
    } catch (error) {
      setDone(false);
      setLoading(false);
      setApiError("An error occurred while sending your message");
      console.error(error);
    }
  };

  const Subjects = [
    "Account Request",
    // Add other subject options if needed
  ];

  // Handle the dialog close
  const handleDialogClose = () => {
    form.setValue("subject", "");
    setCurrentStep(0);
    form.reset();
    setDone(false);
    setLoading(false);
    setShowDialog(false);
    setApiError(null);
  };

  const handleClear = () => {
    form.reset();
    navigate(-1);
  };

  // Update the accReq state when the subject changes
  useEffect(() => {
    if (form.watch("subject") === "Account Request") {
      setAccReq(true);
    } else {
      setAccReq(false);
    }
  }, [form.watch("subject")]);

  // Handle next button click in stepper
  const handleNextButton = () => {
    const { email, subject, message } = form.getValues();

    // Simple validation before proceeding
    if (!email || !subject || !message) {
      alert("Please fill all the required fields");
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-10 pt-10">
      <div className="text-center">
        <h1 className="text-[30px] font-bold dark:text-white">
          Send your request
        </h1>
        <p className="-mt-2 text-sm text-gray-600 dark:text-gray-300">
          Send account request to admin
        </p>
      </div>
      <div
        className="mt-4 flex min-h-fit w-full max-w-[360px] flex-col gap-5"
        ref={parent}
      >
        {accReq && <Stepper steps={steps} currentStep={currentStep} />}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            ref={parent}
          >
            {currentStep < steps.length - 1 && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem ref={parent}>
                      <FormLabel className="after:ml-1 after:text-red-500 after:content-['*']">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-[50px]"
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem ref={parent}>
                      <FormLabel className="after:ml-1 after:text-red-500 after:content-['*']">
                        Subject
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-[50px] w-full border focus:border-emerald-400 dark:border-slate-900 dark:focus:border-emerald-400">
                            <SelectValue placeholder="Subject..." />
                          </SelectTrigger>
                          <SelectContent>
                            {Subjects.map((item, index) => (
                              <SelectItem key={index} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem ref={parent}>
                      <FormLabel className="after:ml-1 after:text-red-500 after:content-['*']">
                        Your Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="border p-3 focus:border-emerald-400 dark:border-slate-900 dark:text-white dark:focus:border-emerald-400"
                          placeholder="Type your message here..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {accReq ? (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      className="min-w-[120px] rounded bg-emerald-600 px-4 py-2 text-white"
                      onClick={() => handleNextButton()}
                    >
                      Next
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      className="mt-6 min-w-[120px] !bg-slate-200 font-bold !text-emerald-600"
                      onClick={handleClear}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      type="submit"
                      className="mt-6 min-w-[120px] bg-emerald-600 font-bold !text-white transition-all ease-in-out hover:bg-emerald-700"
                      loading={submitLoading}
                    >
                      Submit
                    </LoadingButton>
                  </div>
                )}
              </>
            )}
            {currentStep > 0 && (
              <>
                {accReq && (
                  <>
                    <FormField
                      control={form.control}
                      name="team_name"
                      render={({ field }) => (
                        <FormItem ref={parent}>
                          <FormLabel className="after:ml-1 after:text-red-500 after:content-['*']">
                            Club or Department Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-[50px]"
                              placeholder="Team Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Nodal_Officer"
                      render={({ field }) => (
                        <FormItem ref={parent}>
                          <FormLabel className="after:ml-1 after:text-red-500 after:content-['*']">
                            Nodal Officer
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-[50px]"
                              placeholder="Nodal Officer"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="after:ml-1 after:text-red-500 after:content-['*']">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-[50px]"
                              placeholder="Phone Number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contact_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input
                              className="h-[50px]"
                              placeholder="Contact Number (optional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem ref={parent}>
                          <FormLabel className="after:ml-1 after:text-red-500 after:content-['*']">
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-[50px]"
                              placeholder="Password"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <div className="flex items-center justify-between gap-2">
                  <Button
                    type="button"
                    className="ml-2 min-w-[120px] rounded bg-gray-500 px-4 py-2 text-white"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                  <LoadingButton
                    type="submit"
                    className="min-w-[120px] bg-emerald-600 px-4 py-2 font-bold !text-white transition-all ease-in-out hover:bg-emerald-700"
                    loading={submitLoading}
                  >
                    Submit
                  </LoadingButton>
                </div>
              </>
            )}
          </form>
        </Form>
      </div>

      <Dialog open={showDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="min-h-[300px]">
          {loading ? (
            <DialogHeader>
              <DialogTitle className="text-center dark:text-white">
                Loading...
              </DialogTitle>
              <DialogDescription className="text-center dark:text-white">
                Sending your request...
              </DialogDescription>
            </DialogHeader>
          ) : (
            <>
              {done ? (
                <DialogHeader>
                  <DialogTitle className="text-center">Success</DialogTitle>
                  <DialogDescription className="text-center">
                    Submitted Successfully
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      onClick={handleDialogClose}
                      className="mx-auto mt-6 h-[30px] w-fit !bg-emerald-600 px-10 font-bold !text-white"
                    >
                      Done
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              ) : (
                <DialogHeader>
                  <DialogTitle className="text-center text-red-600">
                    Error
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    {apiError || "Submission failed. Please try again later."}
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      onClick={handleDialogClose}
                      className="mx-auto mt-6 h-[30px] w-fit !bg-red-600 px-10 font-bold !text-white"
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
