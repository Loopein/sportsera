import { Loader } from "@/components/shared/Loader";

export default function RootLoading(): React.ReactElement {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8">
      <Loader label="Loading page..." />
    </div>
  );
}

