import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error };
  }
};

// Database helpers
export const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  } catch (error) {
    console.error('Error getting profile:', error);
    return { data: null, error };
  }
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  return { data, error };
};

export const createCategory = async (category: any) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single();
  return { data, error };
};

export const updateCategory = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  return { error };
};

export const getAccounts = async () => {
  const { data, error } = await supabase
    .from('accounts')
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createAccount = async (account: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('accounts')
    .insert([{ ...account, owner_id: user?.id }])
    .select()
    .single();
  return { data, error };
};

export const updateAccount = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('accounts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteAccount = async (id: string) => {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id);
  return { error };
};

export const getSalesData = async (accountId?: string) => {
  let query = supabase
    .from('sales_data')
    .select('*')
    .order('date', { ascending: false });
  
  if (accountId) {
    query = query.eq('account_id', accountId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const createSalesData = async (salesData: any[]) => {
  const { data, error } = await supabase
    .from('sales_data')
    .insert(salesData)
    .select();
  return { data, error };
};

export const deleteSalesData = async (accountId: string, dateRange?: { start: string; end: string }) => {
  let query = supabase
    .from('sales_data')
    .delete()
    .eq('account_id', accountId);
  
  if (dateRange) {
    query = query
      .gte('date', dateRange.start)
      .lte('date', dateRange.end);
  }
  
  const { error } = await query;
  return { error };
};

export const getIncentiveSettings = async () => {
  const { data, error } = await supabase
    .from('incentive_settings')
    .select('*')
    .order('commission_tier', { ascending: true })
    .order('threshold_amount', { ascending: true });
  return { data, error };
};

export const createIncentiveSetting = async (setting: any) => {
  const { data, error } = await supabase
    .from('incentive_settings')
    .insert([setting])
    .select()
    .single();
  return { data, error };
};

export const updateIncentiveSetting = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('incentive_settings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteIncentiveSetting = async (id: string) => {
  const { error } = await supabase
    .from('incentive_settings')
    .delete()
    .eq('id', id);
  return { error };
};