import { Button, Dialog, HelperText, InputLabel } from "@/components";
import { CalendarPicker, FormField } from "@/containers";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiArrowRight } from "react-icons/fi";

const formSchema = z.object({
  title: z.string().min(3, { message: "Minimum 3 characters required" }),
  description: z.string().min(5, { message: "Minimum 5 characters required" }),
  dueAt: z
    .optional(
      z.string().refine((date) => {
        return new Date(date) >= new Date(Date.now());
      }, "The date must be a future date")
    )
    .or(z.literal("")),
});

const INITIAL_VALUE = {
  title: "",
  description: "",
  dueAt: "",
};

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onClose: () => void;
  onSubmit: (values: unknown) => Promise<void>;

  open: false | "create" | "modify";
  initialValue: FormValues | undefined;
}

export const TaskFormDialog = ({
  open,
  onClose,
  initialValue,
}: Props): JSX.Element => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: INITIAL_VALUE,
    resolver: zodResolver(formSchema),
  });

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
    console.log(data);
    onCloseDialog();
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
                  <CalendarPicker id={field.name} {...field} />

                  <HelperText
                    error={Boolean(fieldState.error)}
                    helperText={
                      (fieldState.error && fieldState.error?.message) ||
                      "Enter a due date for you task (Optional)"
                    }
                    className="mt-1"
                  />
                </div>

                // <FormField
                //   {...field}
                //   type="date"
                //   label="Description"
                //   placeholder="Get bread, milk, eggs, etc"
                //   error={Boolean(fieldState.error)}
                //   helperText={
                //     (fieldState.error && fieldState.error?.message) ||
                //     "Enter a due date for you task (Optional)"
                //   }
                // />
              )}
            />

            <div className="flex items-center gap-4 mt-6">
              <Button variant="outline" width="full" onClick={onCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" width="full">
                Add Task <FiArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </form>
      </Dialog.content>
    </Dialog.root>
  );
};
