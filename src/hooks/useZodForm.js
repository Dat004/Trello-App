import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const useZodForm = (schema, options = {}) => {
  return useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
    ...options,
  });
};

export default useZodForm;
