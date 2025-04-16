import { Card, CardHeader, CardContent, CardFooter } from "./Card";
const ThemeSkeleton = () => (
    <Card hover={false} className="h-[28rem] bg-[#F9F9F9] border border-[#F0F0F0]">
      <CardHeader>
        <div className="aspect-4/3 bg-[#F0F0F0] animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-4 bg-[#F0F0F0] rounded-sm animate-pulse w-1/3" />
          <div className="h-6 bg-[#F0F0F0] rounded-sm animate-pulse w-3/4" />
          <div className="h-4 bg-[#F0F0F0] rounded-sm animate-pulse w-2/3" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-[#F0F0F0] rounded-sm animate-pulse w-1/4" />
          <div className="h-10 bg-[#F0F0F0] rounded-sm animate-pulse w-1/3" />
        </div>
      </CardFooter>
    </Card>
  );
  
  export default ThemeSkeleton;  