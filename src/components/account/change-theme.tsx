import { ThemeSelect } from "../theme-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function ChangeTheme() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how Badget looks on your device.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="w-[300px]">
          <ThemeSelect />
        </div>
      </CardContent>
    </Card>
  );
}
