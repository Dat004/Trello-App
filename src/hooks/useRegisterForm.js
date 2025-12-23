import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import registerSchema from "@/schemas/registerSchema";

const useRegisterForm = () => {
  return useForm({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });
};

export default useRegisterForm;
