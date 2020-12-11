import Element from "@heymarco/element";
import Control from "@heymarco/control";


export default class Navbar extends Control {
    constructor(selector : Selector) {
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



    static togglerChangeHandler(event : MouseEvent) {
        const toggler = new Element(event.target as HTMLElement);
        const navbar = new Navbar(toggler.parents(this.class).first());
        const expanded = toggler.is(":checked");

        navbar.markExpand = expanded;
        navbar.markCollapse = !expanded;
    }

    static overlayClickHandler(event : MouseEvent) {
        const overlay = new Element(event.target as HTMLElement);
        const offset = overlay.offset()!;
        const mouseX = event.pageX - offset.left;
        const mouseY = event.pageY - offset.top;

        if ((mouseX < 0) || (mouseX > overlay[0].offsetWidth) && (mouseY < 0) || (mouseY > overlay[0].offsetHeight)) {
            const navbar = overlay.parents(this.class).first();
            new Navbar(navbar).expanded = false;
        }
    }

    static navbarMinSet : boolean | null = null;
    static windowScrollHandler() {
        const position = Element.window.scrollTop()!;
        if (position >= 30) {
            if (this.navbarMinSet !== true) {
                this.navbarMinSet = true;

                new Navbar(this.class).markSticky = true;
            }
        } else {
            if (this.navbarMinSet !== false) {
                this.navbarMinSet = false;

                new Navbar(this.class).markSticky = false;
            }
        }
    }

    static windowResizeHandler() {
        new Navbar(
            new Element(this.class) // find navbar element
            .filter(".collapse")    // with .collapse status
        )
        .markCollapse = false;      // reset .collapse to initial
    }



    static _class = "";
    static _varPrefix = "";
    /**
     * @returns default returning ".navbar"
     */
    static get class() : string {
        return this._class;
    }

    static _togglerChangeHandler = (event: JQuery.ChangeEvent<HTMLElement, undefined, any, any>) => Navbar.togglerChangeHandler(event as unknown as MouseEvent);
    static _overlayClickHandler = (event: JQuery.ClickEvent<HTMLElement, undefined, any, any>) => Navbar.overlayClickHandler(event as unknown as MouseEvent);
    /**
     * Customize the ".navbar" class name.
     */
    static set class(name : string) {
        if (this._class == name) return; // if its already the same, nothing to do.

        if (this._class != "") { // detach prev event (if has set)
            Element.document
            .off("change", `${this.class} .toggler input[type=checkbox], ${this.class} input[type=checkbox].toggler`, this._togglerChangeHandler)
            .off("click", `${this.class} .links`, this._overlayClickHandler)
            ;
        }


        this._class = name;
        this._varPrefix = (name || "").replace(".", "");
        if (this._class != "") {
            Element.document

            // watch the click event of navbar's toggler in whole document.
            // when the navbar's toggler is clicked, the navbar expand/collapse status toggled.
            .on("change", `${this.class} .toggler input[type=checkbox], ${this.class} input[type=checkbox].toggler`, this._togglerChangeHandler)

            // watch the click event of navbar's overlay in whole document.
            // when the navbar's overlay clicked, the navbar status sholud be collapsed.
            .on("click", `${this.class} .links`, this._overlayClickHandler)
            ;
        } // if
    }

    /**
     * @returns default returning "navbar"
     */
    static get varPrefix() : string {
        return this._varPrefix;
    }
}

// watch the scroll event of browser's window.
Element.window
.on("scroll", () => Navbar.windowScrollHandler())
.on("resize", () => Navbar.windowResizeHandler())
;

Navbar.class = ".navbar";
