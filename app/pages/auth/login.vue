<template>
  <div class="flex flex-col gap-4">
    <UContainer class="flex flex-col gap-4">
      <h1 class="text-3xl font-bold">{{ mode === "login" ? "Login" : "Register" }}</h1>

      <UCard>
        <div class="flex flex-col gap-4">
          <UForm :schema="authSchema" :state="authState" class="space-y-4" @submit="handleSubmit">
            <UFormGroup v-if="mode === 'register'" label="Disply name" name="displayName">
              <UInput v-model="authState.displayName" />
            </UFormGroup>

            <UFormGroup label="Email" name="email">
              <UInput v-model="authState.email" />
            </UFormGroup>

            <UFormGroup label="Password" name="password">
              <UInput v-model="authState.password" type="password" />
            </UFormGroup>

            <UFormGroup v-if="mode === 'register'" label="Repeat password" name="passwordRepeat">
              <UInput v-model="authState.passwordRepeat" type="password" />
            </UFormGroup>

            <div class="flex items-center gap-4">
              <UButton v-if="mode === 'login'" type="submit" :loading="loading"> Login </UButton>
              <UButton v-else type="submit" :loading="loading"> Register </UButton>
              <!-- or
              <UButton v-if="mode === 'login'" color="gray" :loading="loading" @click="mode = 'register'"> Register instead </UButton>
              <UButton v-else color="gray" :loading="loading" @click="mode = 'login'"> Login instead </UButton> -->
            </div>
          </UForm>

          <UAlert v-if="errorMesssage" class="text-red-500" title="Error" :description="errorMesssage" />
          <UAlert v-if="successMessage" class="text-green-500" title="Success" :description="successMessage" />
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

useHead({
  title: "Login",
});

const supabase = useSupabaseClient();

const mode = ref<"login" | "register">("login");

const authSchema = z.object({
  displayName: z.string().refine((data) => {
    if (mode.value === "login") return true;

    return data.length >= 3;
  }, "Must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
  passwordRepeat: z.string().refine((data): boolean => {
    if (mode.value === "login") return true;

    return data === authState.value.password;
  }, "Passwords do not match"),
});

type AuthSchema = z.output<typeof authSchema>;

const authState = ref<AuthSchema>({
  displayName: "",
  email: "",
  password: "",
  passwordRepeat: "",
});

const successMessage = ref("");
const errorMesssage = ref("");

const loading = ref(false);

const handleSubmit = async () => {
  if (mode.value === "login") {
    await handleSignIn();
  } else {
    await handleRegister();
  }
};

const handleSignIn = async () => {
  successMessage.value = "";
  errorMesssage.value = "";

  loading.value = true;
  const { error } = await supabase.auth.signInWithPassword({
    email: authState.value.email,
    password: authState.value.password,
  });
  loading.value = false;

  if (error) {
    // @ts-expect-error missing type
    errorMesssage.value = error.error_description || error.message;
    return;
  }

  successMessage.value = "Logged in successfully!";
};

const handleRegister = async () => {
  successMessage.value = "";
  errorMesssage.value = "";

  loading.value = true;
  const { error } = await supabase.auth.signUp({
    email: authState.value.email,
    password: authState.value.password,
    options: {
      data: {
        display_name: authState.value.displayName,
      },
    },
  });
  loading.value = false;

  if (error) {
    // @ts-expect-error missing type
    errorMesssage.value = error.error_description || error.message;
    return;
  }

  successMessage.value = "Check your email for the login link!";
};
</script>
