import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

const Button: React.FC<ButtonProps> = ({ bg = "pink.600", ...rest }) => {
  return (
    <ChakraButton
      bg={bg}
      _hover={{ bg: "pink.900", color: "#aeaeae" }}
      transition="all 0.5s ease-in-out"
      {...rest}
    />
  );
};

export { Button };
