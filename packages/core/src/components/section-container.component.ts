import { Component, Input, OnInit } from '@angular/core';
import { FormSection } from '../models/form-section.model';
import { FormGroup } from '@angular/forms';
import { FormComponent } from '../models/form-component.model';
import { DndService } from '../services/dnd.service';
import { FormPage } from '../models/form-page.model';
import { DndEvent } from '../models/dnd.model';
import { DndTransfer } from '../models/dnd.model';
import { FormQLMode, ContainerType } from '../models/type.model';
import { InternalEventHandlerService } from '../services/internal-event-handler.service';
import { InternalEventType } from '../models/internal-event.model';
import { GridPositionType } from '../models/style.model';
import { StoreService } from '../services/store.service';

@Component({
    // tslint:disable-next-line: component-selector
    selector: '[formql-section-container]',
    template: `
    <div formqlDndDrop [type]="ContainerType.Component"
        [mode]="mode"
        [positionType]="positionType"
        *ngIf="(mode === FormQLMode.Edit)" class="fql-section-container"
        (synchronise)="synchroniseModel($event)">
        <ng-container *ngFor="let component of components; trackBy: trackByFn">
            <div formql-component-container
                [ngClass]="{'fql-component-container-hidden': component.rules?.hidden?.value}"
                [component]="component"
                [sectionId]="section.sectionId"
                [value]="component.value"
                [reactiveSection]="reactiveSection"
                [mode]="mode"></div>
        </ng-container>
    </div>
    <div *ngIf="!(mode === FormQLMode.Edit)">
        <ng-container *ngFor="let component of components; trackBy: trackByFn">
            <div formql-component-container *ngIf="!component.rules?.hidden?.value"
                [component]="component"
                [sectionId]="section.sectionId"
                [value]="component.value"
                [reactiveSection]="reactiveSection"
                [mode]="mode"></div>
        </ng-container>
    </div>`,
    styleUrls: ['./section-container.component.scss'],
    providers: [DndService]
})
export class SectionContainerComponent implements OnInit {

    @Input() page: FormPage;
    @Input() section: FormSection;
    @Input() reactiveSection: FormGroup;
    @Input() positionType: GridPositionType;
    @Input() positionId: string;
    @Input() mode: FormQLMode;

    public FormQLMode = FormQLMode;
    public ContainerType = ContainerType;

    components: FormComponent<any>[] = [];
    constructor(
        private dndService: DndService,
        private storeService: StoreService,
        private eventHandlerService: InternalEventHandlerService
    ) {}

    ngOnInit() {
        this.components = this.findColumnComponents();
    }

    synchroniseModel($event: DndTransfer) {
        const dndEvent = <DndEvent>{
            sourceObjectId: $event.sourceObjectId,
            sourceWrapperId: $event.sourceWrapperId,
            targetPositionId: this.positionId,
            targetWrapperId: this.section.sectionId,
            targetIndexId: $event.targetIndexId,
            positionType: this.positionType
        };
        this.page = this.dndService.synchroniseSectionModel(this.page, dndEvent);
        this.storeService.reSetForm(InternalEventType.DndFormChanged, this.page);
    }

    trackByFn(index, item) {
        return item.id;
    }

    private findColumnComponents(): FormComponent<any>[] {
        const columnComponents: FormComponent<any>[] = [];
        if (this.section.components) {
            this.section.components.forEach(field => {
                if (field.position.id === this.positionId && field.position.type === this.positionType)
                    columnComponents.push(field);
            });
        }

        columnComponents.sort((left: FormComponent<any>, right: FormComponent<any>) => {
            return left.position.index - right.position.index;
        });

        return columnComponents;
    }
}
