import Button from "../common/Button";

type LoginButtonProps = {
  value: string;
  onClick?: () => void;
};

export default function LoginButton({ value }: LoginButtonProps) {
  return (
    <Button size="xl" variant="primary" textSize="lg">
      {value}
    </Button>
  );
}
