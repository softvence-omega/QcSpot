import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-40 text-4xl">
      <Loader2 className="w-20 h-20 animate-spin" />
    </div>
  );
};

export default Loader;
