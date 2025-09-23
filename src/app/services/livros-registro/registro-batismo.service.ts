import { Injectable } from '@angular/core';
import { DadosBatismo } from '../livro/livro-batismo.service';
import { SupabaseService } from '../supabase.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroBatismoService {
  
  constructor(private supabaseService: SupabaseService) {}

  // Cadastrar novo registro
// async adicionarRegistro(livro: string, dados: DadosBatismo) {
//   const { data, error } = await this.supabaseService.supabase
//     .from('registros_batismo')
//     .insert([{ ...dados, livro }])
//     .select()
//     .single();

//   if (error) throw error;
//   return data;
// }

async adicionarRegistro(livro: string, dados: DadosBatismo) {
  // 1. Buscar todos os números de registro existentes para o livro, ordenados
  const { data: registros, error: fetchError } = await this.supabaseService.supabase
    .from('registros_batismo')
    .select('numero_registro')
    .eq('livro', livro)
    .order('numero_registro', { ascending: true });

  if (fetchError) throw fetchError;

  // 2. Encontrar a primeira lacuna (ou o próximo número após o maior)
  let proximoNumero = 1;
  for (const reg of registros || []) {
    if ((reg.numero_registro as unknown as number) !== proximoNumero) break;
    proximoNumero++;
  }

  // 3. Definir a página (1 registro por página)
  const pagina = proximoNumero;

  // 4. Inserir o registro
  const { data, error } = await this.supabaseService.supabase
    .from('registros_batismo')
    .insert([{
      ...dados,
      livro,
      pagina
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}


  // Listar registros de um livro
  async listarRegistros(livro: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('registros_batismo')
      .select('*')
      .eq('livro', livro)
      .order('numero_registro', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Buscar registro pelo id
  async getRegistroPorId(id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('registros_batismo')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Atualizar registro
  async atualizarRegistro(id: string, dados: Partial<DadosBatismo>) {
    const { data, error } = await this.supabaseService.supabase
      .from('registros_batismo')
      .update(dados)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Deletar registro
  async deletarRegistro(id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('registros_batismo')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }
}