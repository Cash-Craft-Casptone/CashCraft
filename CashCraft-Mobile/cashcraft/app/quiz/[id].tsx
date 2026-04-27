import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";
import { quizzes } from "@/data/quizzes";

export default function QuizDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const quiz = quizzes.find(q => q.id === id) || quizzes[0];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  const handleSelect = (index: number) => {
    if (isChecked) return;
    if (Platform.OS !== "web") Haptics.selectionAsync();
    setSelectedAnswer(index);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    if (Platform.OS !== "web") Haptics.notificationAsync(
      selectedAnswer === question.correctAnswerIndex
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error
    );
    if (selectedAnswer === question.correctAnswerIndex) {
      setScore(s => s + 1);
    }
    setIsChecked(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsChecked(false);
    }
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsChecked(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    let message = "Keep learning!";
    if (percentage >= 80) message = "Excellent!";
    else if (percentage >= 50) message = "Good job!";

    return (
      <View style={[styles.container, styles.resultContainer, { backgroundColor: colors.background, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.resultContent}>
          <View style={[styles.trophyCircle, { backgroundColor: colors.secondary }]}>
            <Feather name="award" size={64} color={colors.primary} />
          </View>
          <Text style={[styles.resultTitle, { color: colors.foreground }]}>{message}</Text>
          <Text style={[styles.resultScore, { color: colors.primary }]}>{percentage}%</Text>
          <Text style={[styles.resultText, { color: colors.mutedForeground }]}>
            You scored {score} out of {quiz.questions.length} correct.
          </Text>
        </View>
        <View style={styles.resultActions}>
          <Pressable style={[styles.btn, { backgroundColor: colors.primary, borderRadius: colors.radius }]} onPress={() => router.back()}>
            <Text style={[styles.btnText, { color: colors.primaryForeground }]}>Back to quizzes</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.outlineBtn, { borderColor: colors.border, borderRadius: colors.radius }]} onPress={handleRetake}>
            <Text style={[styles.outlineBtnText, { color: colors.foreground }]}>Retake quiz</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const progress = (currentIndex / quiz.questions.length) * 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.quizHeader}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
            Question {currentIndex + 1} of {quiz.questions.length}
          </Text>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
          <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.quizScroll} contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 120 }}>
        <Text style={[styles.prompt, { color: colors.foreground }]}>{question.prompt}</Text>

        <View style={styles.optionsList}>
          {question.options.map((opt, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = isChecked && idx === question.correctAnswerIndex;
            const isWrong = isChecked && isSelected && idx !== question.correctAnswerIndex;

            let bgColor = colors.card;
            let borderColor = colors.border;

            if (isChecked) {
              if (isCorrect) { bgColor = "#10B98115"; borderColor = "#10B981"; }
              else if (isWrong) { bgColor = "#EF444415"; borderColor = "#EF4444"; }
            } else if (isSelected) {
              borderColor = colors.primary;
              bgColor = colors.secondary;
            }

            return (
              <Pressable
                key={idx}
                style={[
                  styles.optionBtn,
                  { backgroundColor: bgColor, borderColor, borderRadius: colors.radius },
                  isChecked && !isCorrect && !isWrong && { opacity: 0.5 },
                ]}
                onPress={() => handleSelect(idx)}
              >
                <View style={styles.optionContent}>
                  <Text style={[styles.optionText, { color: colors.foreground }, (isCorrect || isWrong) && { fontFamily: "Cairo_700Bold" }]}>
                    {opt}
                  </Text>
                </View>
                {isChecked && isCorrect && <Feather name="check-circle" size={20} color="#10B981" />}
                {isChecked && isWrong && <Feather name="x-circle" size={20} color="#EF4444" />}
              </Pressable>
            );
          })}
        </View>

        {isChecked && question.explanation && (
          <View style={[styles.explanationBox, { backgroundColor: colors.secondary, borderRadius: colors.radius }]}>
            <View style={styles.explanationHeader}>
              <Feather name="info" size={16} color={colors.primary} />
              <Text style={[styles.explanationTitle, { color: colors.primary }]}>Explanation</Text>
            </View>
            <Text style={[styles.explanationText, { color: colors.foreground }]}>{question.explanation}</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom || 24 }]}>
        {!isChecked ? (
          <Pressable
            style={[styles.btn, { backgroundColor: selectedAnswer !== null ? colors.primary : colors.muted, borderRadius: colors.radius }]}
            onPress={handleCheck}
            disabled={selectedAnswer === null}
          >
            <Text style={[styles.btnText, { color: selectedAnswer !== null ? colors.primaryForeground : colors.mutedForeground }]}>
              Check answer
            </Text>
          </Pressable>
        ) : (
          <Pressable style={[styles.btn, { backgroundColor: colors.primary, borderRadius: colors.radius }]} onPress={handleNext}>
            <Text style={[styles.btnText, { color: colors.primaryForeground }]}>
              {isLastQuestion ? "See results" : "Next question"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  quizHeader: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  progressText: { fontFamily: "Cairo_600SemiBold", fontSize: 14 },
  progressBarBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 4 },
  quizScroll: { flex: 1 },
  prompt: { fontFamily: "Cairo_700Bold", fontSize: 24, lineHeight: 32, marginBottom: 32 },
  optionsList: { gap: 16 },
  optionBtn: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, borderWidth: 2 },
  optionContent: { flex: 1, paddingRight: 16 },
  optionText: { fontFamily: "Cairo_500Medium", fontSize: 16, lineHeight: 22 },
  explanationBox: { marginTop: 32, padding: 20 },
  explanationHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  explanationTitle: { fontFamily: "Cairo_700Bold", fontSize: 16 },
  explanationText: { fontFamily: "Cairo_500Medium", fontSize: 15, lineHeight: 24 },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 24, paddingTop: 16, borderTopWidth: 1 },
  btn: { height: 56, alignItems: "center", justifyContent: "center" },
  btnText: { fontFamily: "Cairo_700Bold", fontSize: 18 },
  resultContainer: { justifyContent: "center", padding: 24 },
  resultContent: { alignItems: "center", marginBottom: 48 },
  trophyCircle: { width: 120, height: 120, borderRadius: 60, alignItems: "center", justifyContent: "center", marginBottom: 32 },
  resultTitle: { fontFamily: "Cairo_700Bold", fontSize: 32, marginBottom: 8 },
  resultScore: { fontFamily: "Cairo_700Bold", fontSize: 48, marginBottom: 16 },
  resultText: { fontFamily: "Cairo_500Medium", fontSize: 16, textAlign: "center" },
  resultActions: { gap: 16 },
  outlineBtn: { borderWidth: 2, backgroundColor: "transparent" },
  outlineBtnText: { fontFamily: "Cairo_700Bold", fontSize: 18 },
});
