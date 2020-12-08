"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const element_1 = __importDefault(require("@heymarco/element"));
const control_1 = __importDefault(require("@heymarco/control"));
const modal_1 = __importDefault(require("@heymarco/modal"));
class Navbar extends control_1.default {
    constructor(selector) {
        super(selector);
    }
    get toggler() {
        return this.find(".toggler input[type=checkbox], input[type=checkbox].toggler");
    }
    get expanded() {
        return this.toggler.is(":checked");
    }
    set expanded(expanded) {
        this.toggler
            .filter(expanded ? ":not(:checked)" : ":checked")
            .prop("checked", !!expanded)
            .trigger("change");
    }
    markSticky(sticky) {
        this.toggleClass("sticky", sticky);
    }
    static togglerChangeHandler(event) {
        const toggler = new element_1.default(event.target);
        const navbar = toggler.parents(".navbar").first();
        modal_1.default.setActive((toggler.is(":checked") ? navbar : null));
    }
    static overlayClickHandler(event) {
        const overlay = new element_1.default(event.target);
        const offset = overlay.offset();
        const mouseX = event.pageX - offset.left;
        const mouseY = event.pageY - offset.top;
        if ((mouseX < 0) || (mouseX > overlay[0].offsetWidth) && (mouseY < 0) || (mouseY > overlay[0].offsetHeight)) {
            const navbar = overlay.parents(".navbar").first();
            new Navbar(navbar).expanded = false;
        }
    }
    static windowScrollHandler() {
        const position = element_1.default.window.scrollTop();
        if (position >= 30) {
            if (this.navbarMinSet !== true) {
                this.navbarMinSet = true;
                new Navbar(".navbar").markSticky(true);
            }
        }
        else {
            if (this.navbarMinSet !== false) {
                this.navbarMinSet = false;
                new Navbar(".navbar").markSticky(false);
            }
        }
    }
}
exports.default = Navbar;
Navbar.navbarMinSet = null;
element_1.default.document.on("change", ".navbar .toggler input[type=checkbox], .navbar input[type=checkbox].toggler", (event) => Navbar.togglerChangeHandler(event));
element_1.default.document.on("click", ".navbar .links", (event) => Navbar.overlayClickHandler(event));
element_1.default.window.on("scroll", () => Navbar.windowScrollHandler());
