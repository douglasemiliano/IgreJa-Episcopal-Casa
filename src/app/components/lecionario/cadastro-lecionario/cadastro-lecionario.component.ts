import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupabaseService } from '../../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LecionarioService } from '../../../services/lecionario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-lecionario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './cadastro-lecionario.component.html',
  styleUrl: './cadastro-lecionario.component.scss'
})
export class CadastroLecionarioComponent implements OnInit {
 lecionarioParaEditar: any = null;
  form: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar,
    private lecionarioService: LecionarioService,
    private router: Router
  ) {
    this.form = this.fb.group({
      ano_liturgico: ['C', Validators.required],
      tempo: ['', Validators.required],
      dia: ['', Validators.required],
      nome: ['', Validators.required],
      oracoes: this.fb.array([this.fb.control('', Validators.required)]),
      leituras: this.fb.array([this.createLeituraFormGroup()])
    });
  }

  ngOnInit() {
    this.lecionarioParaEditar =  this.lecionarioService.lecionarioSelecionado();
    if (this.lecionarioParaEditar) {
      this.isEditMode = true;
      this.populateForm(this.lecionarioParaEditar);
    }
  }


  ngOnDestroy(){
    this.lecionarioService.setLecionarioSelecionado(null);
  }

  populateForm(data: any) {
    this.form.addControl('id', this.fb.control(data.id));
    this.form.patchValue({
      id: data.id,
      ano_liturgico: data.ano_liturgico,
      tempo: data.tempo,
      dia: new Date(data.dia+ 'T00:00:00'),
      nome: data.nome
    });

    this.form.setControl(
      'oracoes',
      this.fb.array(data.oracoes.map((o: string) => this.fb.control(o, Validators.required)))
    );

    this.form.setControl(
      'leituras',
      this.fb.array(data.leituras.map((l: any) =>
        this.fb.group({
          tipo: [l.tipo, Validators.required],
          texto: [l.texto, Validators.required]
        })
      ))
    );
  }

  get oracoes(): FormArray {
    return this.form.get('oracoes') as FormArray;
  }

  get leituras(): FormArray {
    return this.form.get('leituras') as FormArray;
  }

  addOracao() {
    this.oracoes.push(this.fb.control('', Validators.required));
  }

  removeOracao(index: number) {
    this.oracoes.removeAt(index);
  }

  addLeitura() {
    this.leituras.push(this.createLeituraFormGroup());
  }

  removeLeitura(index: number) {
    this.leituras.removeAt(index);
  }

  createLeituraFormGroup(): FormGroup {
    return this.fb.group({
      tipo: ['', Validators.required],
      texto: ['', Validators.required]
    });
  }

  async submit() {
    if (this.form.valid) {
      const data = this.form.value;

      if (this.isEditMode) {
        const { error } = await this.supabaseService.updateLectionary(data.id, data);
        if (error) {
          this.snackBar.open('Erro ao atualizar registro.', 'Fechar', { duration: 3000, panelClass: ['snackbar-error'] });
        } else {
          this.snackBar.open('Registro atualizado com sucesso!', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] });
        }
      } else {
        const { error } = await this.supabaseService.insertLectionary(data);
        if (error && error.details?.includes("already exists")) {
          this.snackBar.open('Já existe um registro para esse dia. Por favor, escolha outra data.', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
          return;
        }

        this.snackBar.open('Registro cadastrado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        this.form.reset();
        this.form.setControl('oracoes', this.fb.array([this.fb.control('')]));
        this.form.setControl('leituras', this.fb.array([this.createLeituraFormGroup()]));
      }

      this.router.navigateByUrl("listar-lecionario")
    }
  }
}
