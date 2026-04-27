import { useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { useSettings } from "@/contexts/SettingsContext";

export function useColors() {
  const systemScheme = useColorScheme();
  const { themePreference } = useSettings();

  const effectiveScheme = themePreference === "system" ? systemScheme : themePreference;

  const palette = effectiveScheme === "dark" ? colors.dark : colors.light;

  return { ...palette, radius: colors.radius };
}
