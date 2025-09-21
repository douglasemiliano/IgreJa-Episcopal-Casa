import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent, data: { animation: 'home' } },
    { path: 'lecionario', loadComponent: () => import('./components/lecionario/view-lecionario/view-lecionario.component').then(c => c.ViewLecionarioComponent)}, 
    { path: 'lecionario/listar', loadComponent: () => import('./components/lecionario/listar-lecionario/listar-lecionario.component').then(c => c.ListarLecionarioComponent), canActivate: [AuthGuard] },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: "login", loadComponent: () => import('./components/auth/login/login.component').then(c => c.LoginComponent) },
    { path: 'lecionario/cadastro', loadComponent: () => import('./components/lecionario/cadastro-lecionario/cadastro-lecionario.component').then(c => c.CadastroLecionarioComponent), canActivate: [AuthGuard] },
    { path: 'certificado', loadComponent: ()=> import('./components/certificado/certificado.component').then(c => c.CertificadoComponent), canActivate: [AuthGuard]},
    { path: 'certificado/confirmacao', loadComponent: () => import('./components/certificado/certificado-confirmacao/certificado-confirmacao.component').then(c => c.CertificadoConfirmacaoComponent) },
    { path: 'certificado/batismo', loadComponent: () => import('./components/certificado/certificado-batismo/certificado-batismo.component').then(c => c.CertificadoBatismoComponent) },
    { path: 'membros/cadastrar', loadComponent: () => import('./components/membros/cadastrar-membro/cadastrar-membro.component').then(c => c.CadastrarMembroComponent), canActivate: [AuthGuard] },
    { path: 'membros', loadComponent: () => import('./components/membros/listar-membro/listar-membro.component').then(c => c.ListarMembrosComponent), canActivate: [AuthGuard] },
    { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent), canActivate: [AuthGuard] },
];
