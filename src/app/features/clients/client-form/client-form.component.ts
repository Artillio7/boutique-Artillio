import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../services/clients.service';
import { IClient } from '../../../core/models/client.interface';

@Component({
    selector: 'app-client-form',
    templateUrl: './client-form.component.html',
    styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
    clientForm: FormGroup;
    isEditMode = false;
    clientId: number | null = null;

    constructor(
        private fb: FormBuilder,
        private clientsService: ClientsService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.clientForm = this.fb.group({
            nom: ['', [Validators.required, Validators.maxLength(100)]],
            prenom: ['', [Validators.required, Validators.maxLength(100)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
            telephone: ['', Validators.maxLength(30)],
            adresse: ['', Validators.maxLength(300)]
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.clientId = +params['id'];
                this.loadClient(this.clientId);
            }
        });
    }

    loadClient(id: number): void {
        this.clientsService.getById(id).subscribe(client => {
            this.clientForm.patchValue(client);
        });
    }

    onSubmit(): void {
        if (this.clientForm.invalid) {
            return;
        }

        const clientData: IClient = {
            id: this.clientId || 0,
            ...this.clientForm.value,
            dateCreation: new Date().toISOString() // Backend might ignore this on update
        };

        if (this.isEditMode && this.clientId) {
            this.clientsService.update(this.clientId, clientData).subscribe(() => {
                this.router.navigate(['/clients']);
            });
        } else {
            this.clientsService.create(clientData).subscribe(() => {
                this.router.navigate(['/clients']);
            });
        }
    }
}
