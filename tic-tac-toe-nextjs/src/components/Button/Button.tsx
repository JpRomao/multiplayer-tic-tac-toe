import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

const Button: React.FC<ButtonProps> = ({ bg = "pink.600", ...rest }) => {
  return <ChakraButton bg={bg} {...rest} />;
};

export { Button };
