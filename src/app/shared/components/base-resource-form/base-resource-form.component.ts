import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';


import toastr from "toastr";
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

    currentAction: string; //edit or create
    resourceForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[] = null;
    submittingForm: boolean = false;

    protected route: ActivatedRoute;
    protected router: Router;
    protected formBuilder: FormBuilder;

    constructor(
        protected injector: Injector,
        public resource: T,
        protected resourceService: BaseResourceService<T>,
        protected jsonDataToResourceFn: (jsonData) => T

    ) {
        this.route = this.injector.get(ActivatedRoute);
        this.router = this.injector.get(Router);
        this.formBuilder = this.injector.get(FormBuilder);

    }

    ngOnInit(): void {

        this.setCurrentAction();//action executing
        this.buildResourceForm();//construir form
        this.loadResource();//carregar novamente a lista de T
    }

    ngAfterContentChecked() {

        this.setPageTitle();
    }

    submitForm() {
        this.submittingForm = true;
        if (this.currentAction == "new") {
            this.createResource();
        } else {//== "edit"
            this.updateResource();
        }
    }

    // Private Methods

    protected setCurrentAction() {
        if (this.route.snapshot.url[0].path == "new") {
            //take content that is in the url [0] 
            // /T/new
            this.currentAction = "new"
        } else {
            this.currentAction = "edit"
        }
    }

    protected loadResource() {
        if (this.currentAction == "edit") {

            this.route.paramMap.pipe(
                switchMap(params => this.resourceService.getById(+params.get("id")))//take from url/route the value of id 
            )
                .subscribe(
                    (resource) => {
                        this.resource = resource;
                        this.resourceForm.patchValue(resource)
                    },
                    (error) => alert('Ocorreu um erro no servidor, tente mais tarde')
                )
        }
    }

    protected setPageTitle() {
        if (this.currentAction == 'new') {
            this.pageTitle = this.creationPageTitle();
        }
        else {
            this.pageTitle = this.editionPageTitle();
        }
    }

    protected editionPageTitle(): string {
        return 'Edição'
    }

    protected creationPageTitle(): string {
        return 'Novo'
    }

    protected createResource() {
        const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)

        this.resourceService.create(resource)
            .subscribe(
                resource => this.actionsForSucess(resource),
                error => this.actionsForError(error)
            )
    }

    protected updateResource() {

        const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)

        this.resourceService.update(resource)
            .subscribe(
                resource => this.actionsForSucess(resource),
                error => this.actionsForError(error)
            )
    }

    protected actionsForSucess(resource: T) {

        const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

        toastr.success('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-sunglasses-fill" viewBox="0 0 16 16">    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM2.31 5.243A1 1 0 0 1 3.28 4H6a1 1 0 0 1 1 1v.116A4.22 4.22 0 0 1 8 5c.35 0 .69.04 1 .116V5a1 1 0 0 1 1-1h2.72a1 1 0 0 1 .97 1.243l-.311 1.242A2 2 0 0 1 11.439 8H11a2 2 0 0 1-1.994-1.839A2.99 2.99 0 0 0 8 6c-.393 0-.74.064-1.006.161A2 2 0 0 1 5 8h-.438a2 2 0 0 1-1.94-1.515L2.31 5.243zM4.969 9.75A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .866-.5z"/>  </svg>', 'Solicitação processada com sucesso!');
        // nomedosite.com/T/new
        // nomedosite.com/T/
        // nomedosite.com/T/:id/edit
        //redirect/reload componenet page

        this.router

        this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true })//don't show up in to the browser history
            .then(
                () => this.router.navigate([baseComponentPath, resource.id, "edit"])
            )
    }

    protected actionsForError(error) {

        toastr.error('Ocorreu um erro ao processar a sua solicitação, <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-dizzy-fill ml-2" viewBox="0 0 16 16">    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM4.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM8 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>  </svg>');
        
        this.submittingForm = false;

        if (error.status === 422) {//error when server can´t save date
            this.serverErrorMessages = JSON.parse(error._body).errors; // return [strings]
        } else {
            //conection server error
            this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente novamente mais tarde."]
        }

    }

    protected abstract buildResourceForm(): void;
}
