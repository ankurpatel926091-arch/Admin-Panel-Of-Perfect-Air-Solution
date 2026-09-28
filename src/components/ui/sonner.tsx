import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({
  position = "top-right",
  richColors = true,
  closeButton = true,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position={position}
      richColors={richColors}
      closeButton={closeButton}
      icons={{
        success: <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />,
        error: <AlertCircle className="w-5 h-5 text-white" strokeWidth={2.5} />,
        warning: <AlertTriangle className="w-5 h-5 text-white" strokeWidth={2.5} />,
        info: <Info className="w-5 h-5 text-white" strokeWidth={2.5} />,
        loading: <Loader2 className="w-5 h-5 text-white animate-spin" strokeWidth={2.5} />,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
