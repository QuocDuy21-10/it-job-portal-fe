import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useFocusFirstError } from "./use-focus-first-error";

function Fixture() {
  const form = useForm({
    defaultValues: { a: "", b: "" },
    shouldFocusError: false,
  });
  useFocusFirstError(form.formState.submitCount, "f");
  // Registered b first, rendered a first: DOM order must win.
  form.register("b", { required: true });
  return (
    <Form {...form}>
      <form id="f" onSubmit={form.handleSubmit(() => {})}>
        {(["a", "b"] as const).map((name) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input aria-label={name} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        ))}
        <button>save</button>
      </form>
    </Form>
  );
}

it("focuses the first invalid field in DOM order", async () => {
  render(<Fixture />);
  fireEvent.click(screen.getByText("save"));
  await waitFor(() => expect(screen.getByLabelText("a")).toHaveFocus());
});
