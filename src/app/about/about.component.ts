import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from '../../environments/environment';
import { DataIOService } from '../shared/data/data-io.service';
import * as Dto from '../shared/data/dto';

@Component({
  selector: 'gbg-about',
  styleUrls: ['./about.component.scss'],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
  public jsonInfo = '{}';
  public isAuthenticated?: boolean;
  public uid?: string;
  public displayName?: string;
  public email?: string;
  public photoURL?: string;
  public environmentKeys: string[] = [
    'INPUT_ACTION',
    'INPUT_APP_BUILD_COMMAND',
    'INPUT_APP_LOCATION',
    'INPUT_API_LOCATION',
    'INPUT_APP_ARTIFACT_LOCATION',
    'INPUT_API_BUILD_COMMAND',
    'INPUT_ROUTES_LOCATION',
    'HOME',
    'GITHUB_JOB',
    'GITHUB_REF',
    'GITHUB_SHA',
    'GITHUB_REPOSITORY',
    'GITHUB_REPOSITORY_OWNER',
    'GITHUB_RUN_ID',
    'GITHUB_RUN_NUMBER',
    'GITHUB_RETENTION_DAYS',
    'GITHUB_ACTOR',
    'GITHUB_WORKFLOW',
    'GITHUB_HEAD_REF',
    'GITHUB_BASE_REF',
    'GITHUB_EVENT_NAME',
    'GITHUB_SERVER_URL',
    'GITHUB_API_URL',
    'GITHUB_GRAPHQL_URL',
    'GITHUB_WORKSPACE',
    'GITHUB_ACTION',
    'GITHUB_EVENT_PATH',
    'GITHUB_PATH',
    'GITHUB_ENV',
    'RUNNER_OS',
    'RUNNER_TOOL_CACHE',
    'RUNNER_TEMP',
    'RUNNER_WORKSPACE',
    'ACTIONS_RUNTIME_URL',
    'ACTIONS_RUNTIME_TOKEN',
    'ACTIONS_CACHE_URL',
  ];
  public showEnviornment = false;
  public env: {
    firebase: any;
    azure: { [key: string]: string };
    production: boolean;
  } = environment;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private io: DataIOService
  ) {}

  public ngOnInit(): void {
    this.afAuth.authState.subscribe(async (user) => {
      if (user && user.uid) {
        this.isAuthenticated = true;
        this.displayName = user.displayName || 'FALSY NAME';
        this.photoURL = user.photoURL || 'assets/img/personal.png';
        const info = await this.io.load();
        this.jsonInfo = JSON.stringify(info, null, 2);
      } else {
        this.displayName = 'NOT LOGGED IN';
      }
    });
  }

  public clearData(): void {
    if (confirm('About to Reset')) {
      this.io.clearAll();
      this.router.navigateByUrl('home');
    }
  }

  public replaceAppInfoForever(): void {
    try {
      const dto: Dto.AppInfo = JSON.parse(this.jsonInfo);
      this.doReplace(dto).then(
        (done: boolean) => done && this.router.navigateByUrl('home')
      );
    } catch (e) {
      alert(e);
    }
  }

  public logout() {
    this.afAuth.signOut();
  }

  public toggleEnvironmentTable():void{
    this.showEnviornment = !this.showEnviornment;
  }

  private doReplace(newInfo: Dto.AppInfo): Promise<boolean> {
    if (confirm('WARNING this is not validated. About to replace your data')) {
      return this.io.saveAll(newInfo).then((_replaced) => true);
    }
    return Promise.resolve(false);
  }
}
