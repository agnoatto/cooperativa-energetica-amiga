import React from "react";
import { Input } from "@/components/ui/input";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  (props, ref) => (
    <Input
      {...props}
      ref={ref}
    />
  )
);

MaskedInput.displayName = "MaskedInput";

export default MaskedInput;