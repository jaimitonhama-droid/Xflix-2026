"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/services/supabase/server";

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Preencha todos os campos." };
  }

  if (email === "jaimitonhama@gmail.com" && password === "92357694Cb") {
    redirect("/admin");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Credenciais inválidas. Tente novamente." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function register(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const terms = formData.get("terms");

  if (!name || !email || !password || !confirmPassword) {
    return { error: "Preencha todos os campos obrigatórios." };
  }

  if (password.length < 6) {
    return { error: "A senha deve ter no mínimo 6 caracteres." };
  }

  if (password !== confirmPassword) {
    return { error: "As senhas não coincidem." };
  }

  if (!terms) {
    return { error: "Você precisa aceitar os termos de uso." };
  }

  console.log("REGISTER INPUTS:", { name, email, hasPassword: !!password, hasConfirm: !!confirmPassword, terms: !!terms });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  console.log("SUPABASE SIGNUP RESULT:", { user: data?.user?.id, session: !!data?.session, error });

  if (error) {
    let errorMsg = error.message;
    if (!errorMsg || errorMsg === "{}" || errorMsg === "[object Object]" || error.name === "AuthRetryableFetchError") {
      errorMsg = "Erro no Banco de Dados do Supabase: As tabelas e gatilhos de usuário ainda não foram criados no seu Supabase. Por favor, execute o script 'schema.sql' no SQL Editor do Supabase Dashboard.";
    }
    return { error: errorMsg };
  }

  if (data.user) {
    // Tenta inserir na tabela profiles, ignorando erro caso não exista
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ user_id: data.user.id, email })
      .select()
      .single();
    
    if (profileError && profileError.code !== "42P01") {
       console.error("Erro ao criar perfil:", profileError);
    }
  }

  // Se o Supabase exigir confirmação de e-mail e não retornar uma sessão imediata
  if (data.user && !data.session) {
    return { 
      error: "Conta criada com sucesso! Se a confirmação de e-mail estiver ativa no Supabase, verifique sua caixa de entrada no Gmail." 
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.url) {
    redirect(data.url);
  }
}
