import { Button, Dialog, HelperText, InputLabel } from "@/components";
import { CalendarPicker, FormField } from "@/containers";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";
import { postTaskAPI } from "@/api/task/postTaskAPI";
import { patchTaskAPI } from "@/api/task/patchTaskAPI";

const formSchema = z.object({
  title: z.string().min(3, { message: "Minimum 3 characters required" }),
  description: z.string().min(5, { message: "Minimum 5 characters required" }),
  dueAt: z
    .optional(
      z.string().refine((date) => {
        return new Date(date) >= new Date(Date.now());
      }, "The date must be a future date")
    )
    .nullish()
    .or(z.literal("")),
});

const INITIAL_VALUE = {
  title: "",
  description: "",
  dueAt: "",
};

type FormValues = z.infer<typeof formSchema> & { id: string };

interface Props {
  onClose: () => void;
  onSubmit: (values: unknown) => Promise<void>;

  onUpdate: () => void;
  open: false | "create" | "modify";
  initialValue: FormValues | undefined;
}

export const TaskFormDialog = ({
  open,
  onClose,
  onUpdate,
  initialValue,
}: Props): JSX.Element => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: INITIAL_VALUE,
    resolver: zodResolver(formSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open === "modify") {
      reset(initialValue || INITIAL_VALUE);
    }
  }, [open, reset, initialValue]);

  const onCloseDialog = () => {
    onClose();
    reset(INITIAL_VALUE);
  };

  const onSubmit: SubmitHandler<any> = (data) => {
    if (open === "modify") {
      if (!initialValue || !initialValue.id) return;

      setIsLoading(true);
      toast.promise(patchTaskAPI(initialValue.id, data), {
        loading: "Updating Task",
        success: () => {
          setIsLoading(false);
          onCloseDialog();
          onUpdate();
          return "Task updated successfully";
        },
        error: (err) => {
          setIsLoading(false);
          return err?.response?.data?.message || "Error during updation";
        },
      });
    } else {
      setIsLoading(true);
      toast.promise(postTaskAPI(data), {
        loading: "Adding Task",
        success: () => {
          setIsLoading(false);
          onCloseDialog();
          onUpdate();
          return "Task added successfully";
        },
        error: (err) => {
          setIsLoading(false);
          return err?.response?.data?.message || "Error during creation";
        },
      });
    }
  };

  return (
    <Dialog.root open={Boolean(open)} onOpenChange={() => onCloseDialog()}>
      <Dialog.content
        aria-describedby={`Dialog to ${
          open === "create" ? "create a new" : "update an existing"
        } task.`}
        className="max-w-md"
      >
        <Dialog.header>
          <Dialog.title>
            {open === "create" ? "Add Task" : "Update Task"}
          </Dialog.title>
        </Dialog.header>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <Controller
              control={control}
              name="title"
              render={({ field, fieldState }) => (
                <FormField
                  {...field}
                  label="Title"
                  placeholder="Get groceries"
                  error={Boolean(fieldState.error)}
                  helperText={
                    (fieldState.error && fieldState.error?.message) ||
                    "Enter a title for you task"
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <FormField
                  {...field}
                  component="textarea"
                  label="Description"
                  placeholder="Get bread, milk, eggs, etc"
                  error={Boolean(fieldState.error)}
                  helperText={
                    (fieldState.error && fieldState.error?.message) ||
                    "Enter a description for you task"
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="dueAt"
              render={({ field, fieldState }) => (
                <div>
                  <InputLabel htmlFor={"dueAt"}>Due Date</InputLabel>
                  <CalendarPicker
                    id={field.name}
                    {...field}
                    value={field.value || undefined}
                  />

                  <HelperText
                    error={Boolean(fieldState.error)}
                    helperText={
                      (fieldState.error && fieldState.error?.message) ||
                      "Enter a due date for you task (Optional)"
                    }
                    className="mt-1"
                  />
                </div>
              )}
            />

            <div className="flex items-center gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                width="full"
                onClick={() => onCloseDialog()}
              >
                Cancel
              </Button>
              <Button type="submit" width="full">
                {open === "create" ? "Add Task" : "Update Task"}
                <FiArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </form>
      </Dialog.content>
    </Dialog.root>
  );
};
