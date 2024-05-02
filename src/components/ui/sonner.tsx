import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group toast group-[.toaster]:bg-success-foreground dark:group-[.toaster]:bg-success group-[.toaster]:text-success dark:group-[.toaster]:text-success-foreground group-[.toaster]:shadow-lg",
          error:
            "group toast group-[.toaster]:bg-destructive-foreground dark:group-[.toaster]:bg-destructive group-[.toaster]:text-destructive dark:group-[.toaster]:text-destructive-foreground group-[.toaster]:shadow-lg",
          info: "group toast group-[.toaster]:bg-info-foreground dark:group-[.toaster]:bg-info group-[.toaster]:text-info dark:group-[.toaster]:text-info-foreground group-[.toaster]:shadow-lg",
          warning:
            "group toast group-[.toaster]:bg-warning-foreground dark:group-[.toaster]:bg-warning group-[.toaster]:text-warning dark:group-[.toaster]:text-warning-foreground group-[.toaster]:shadow-lg",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
