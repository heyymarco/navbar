import Element from "@heymarco/element";
import Control from "@heymarco/control";
import ElementConfig from "@heymarco/element-config";



/**
 * A responsive navigation header. Fully customizable via css variables.
 */
export default class Navbar extends Control {
    constructor(selector : Selector = Navbar.config.class) {
        super(selector);
    }



    get toggler() {
        return this.find(".toggler input[type=checkbox], input[type=checkbox].toggler");
    }
    

    get markSticky() : boolean {
        return this.is(".sticky");
    }
    set markSticky(sticky : boolean) {
        this.toggleClass("sticky", sticky);
    }


    get expanded() : boolean {
        return this.toggler.is(":checked");
    }
    set expanded(expanded : boolean) {
        this.toggler
        .filter(expanded ? ":not(:checked)" : ":checked")
        .prop("checked", !!expanded)
        .trigger("change")
        ;
    }

    get markExpand() : boolean {
        return this.is(".expand");
    }
    set markExpand(expand : boolean) {
        this.toggleClass("expand", expand);
    }

    get markCollapse() : boolean {
        return this.is(".collapse");
    }
    set markCollapse(collapse : boolean) {
        this.toggleClass("collapse", collapse);
    }



    /**
     * A function to be executed when the toggler's state changed.
     */
    static togglerChangeHandler(event : MouseEvent) {
        const toggler = new Element(event.target as HTMLElement);
        const navbar = new Navbar(toggler.parents(Navbar.config.class).first());
        const expanded = toggler.is(":checked");

        navbar.markExpand   = expanded;
        navbar.markCollapse = !expanded;
    }

    /**
     * A function to be executed when the navbar's menu or its children clicked.
     */
    static menuClickHandler(event : MouseEvent) {
        const menu = new Element(event.target as HTMLElement);
        const offset = menu.offset()!;
        const mouseX = event.pageX - offset.left;
        const mouseY = event.pageY - offset.top;

        if ((mouseX < 0) || (mouseX > menu[0].offsetWidth) && (mouseY < 0) || (mouseY > menu[0].offsetHeight)) {
            this.overlayClickHandler(event);
        }
    }

    /**
     * A function to be executed when the navbar's overlay clicked.
     */
    static overlayClickHandler(event : MouseEvent) {
        const menuOverlay = new Element(event.target as HTMLElement);
        const navbar = new Navbar(menuOverlay.parents(Navbar.config.class).first());

        navbar.expanded = false;
    }

    static _navbarMinSet : boolean | null = null;
    /**
     * A function to be executed when the browser's window scrolled.
     */
    static windowScrollHandler() {
        const position = Element.window.scrollTop()!;
        if (position >= 30) {
            if (this._navbarMinSet !== true) {
                this._navbarMinSet = true;

                new Navbar().markSticky = true;
            }
        } else {
            if (this._navbarMinSet !== false) {
                this._navbarMinSet = false;

                new Navbar().markSticky = false;
            }
        }
    }

    /**
     * A function to be executed when the browser's window resized.
     */
    static windowResizeHandler() {
        new Navbar(
            new Element(Navbar.config.class) // find navbar element
            .filter(".collapse")    // with .collapse status
        )
        .markCollapse = false;      // reset .collapse to initial
    }



    static _togglerChangeHandler    = (event: JQuery.ChangeEvent<HTMLElement, undefined, any, any>) => Navbar.togglerChangeHandler(event as unknown as MouseEvent);
    static _menuClickHandler        = (event: JQuery.ClickEvent<HTMLElement, undefined, any, any>)  => Navbar.menuClickHandler(event as unknown as MouseEvent);
    static config = new ElementConfig(
        /* className    = */ ".navbar",
        /* varPrefix    = */ "navbar",
        /* deconfigure  = */ () => {
            Element.document

            // un-watch the click event of navbar's toggler in whole document.
            .off("change", `${Navbar.config.class} .toggler input[type=checkbox], ${Navbar.config.class} input[type=checkbox].toggler`, Navbar._togglerChangeHandler)

            // un-watch the click event of navbar's overlay in whole document.
            .off("click", `${Navbar.config.class} .menu`, Navbar._menuClickHandler)
            ;
        },
        /* configure    = */ () => {
            Element.document

            // watch the click event of navbar's toggler in whole document.
            // when the navbar's toggler is clicked, the navbar should be toggled expanded/collapsed.
            .on("change", `${Navbar.config.class} .toggler input[type=checkbox], ${Navbar.config.class} input[type=checkbox].toggler`, Navbar._togglerChangeHandler)

            // watch the click event of navbar's overlay in whole document.
            // when the navbar's overlay is clicked, the navbar should be collapsed.
            .on("click", `${Navbar.config.class} .menu`, Navbar._menuClickHandler)
            ;
        },
        /* configFirst  = */ true // it's safe to apply the config immediately.
    );

    static startup() : void {
        Element.window
        // watch the scroll event of browser's window.
        .on("scroll", () => Navbar.windowScrollHandler())

        // watch the resize event of browser's window.
        .on("resize", () => Navbar.windowResizeHandler())
        ;
    }
}
Element.startup(Navbar.startup);