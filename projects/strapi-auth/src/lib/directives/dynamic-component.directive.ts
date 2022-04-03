import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  Renderer2,
  Type,
  ViewContainerRef
} from '@angular/core';
import { TemplateService } from '../services/template/template.service';
import AuthComponents from '../types/enums/AuthComponents';

@Directive({
  selector: '[strapiDynamicComponent]'
})
export class DynamicComponentDirective {
  protected componentRef: ComponentRef<any> | null = null;

  @Input() authComponent: AuthComponents | undefined | null = null;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
    private renderer: Renderer2,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    if (this.authComponent && this.authComponent) {
      const component = this.templateService.getComponent(
        this.authComponent
      ) as Type<unknown>;

      if (component) {
        const factory = this.resolver.resolveComponentFactory(component);
        this.componentRef = this.container.createComponent(
          factory
        ) as ComponentRef<any>;

        this.componentRef.instance.dynamicControl = this.authComponent;
      }
    }
  }
}
