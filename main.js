/*
 * Copyright (c) 2013 Peter Flynn.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */


/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, regexp: true */
/*global define, brackets, $ */

define(function (require, exports, module) {
    "use strict";
    
    // Brackets modules
    var DocumentManager         = brackets.getModule("document/DocumentManager"),
        EditorManager           = brackets.getModule("editor/EditorManager"),
        Menus                   = brackets.getModule("command/Menus"),
        CommandManager          = brackets.getModule("command/CommandManager");
    
    
    /** @type {?Editor} */
    var currentEditor;
    
    
    function gotoLastEdit() {
        // If we've seen an edit in this Editor yet, jump to its location
        var lastPos = currentEditor.__lastEditPos;
        if (lastPos) {
            currentEditor.setCursorPos(lastPos.line, lastPos.ch, true);
        }
    }
    
    
    /** Remember the location of this most-recent edit */
    function handleDocumentChange(event, document, changeList) {
        // TODO: handle multipart changeLists
        currentEditor.__lastEditPos = changeList.from;
    }
    
    /**
     * Listen for edits on active document so we can remember the last edit position
     */
    function handleActiveEditorChange(event, newEditor) {
        if (currentEditor) {
            $(currentEditor.document).off("change", handleDocumentChange);
            currentEditor = null;
        }
        
        currentEditor = newEditor;
        
        if (currentEditor) {
            $(currentEditor.document).on("change", handleDocumentChange);
        }
    }
    
    
    // Listen for editors to attach to
    $(EditorManager).on("activeEditorChange", handleActiveEditorChange);
    handleActiveEditorChange(EditorManager.getActiveEditor());
    
    // Register command
    var COMMAND_ID = "pflynn.goto_last_edit";
    CommandManager.register("Go to Last Edit", COMMAND_ID, gotoLastEdit);
    
    var menu = Menus.getMenu(Menus.AppMenuBar.NAVIGATE_MENU);
    menu.addMenuItem(COMMAND_ID, ["Ctrl-8", "Ctrl-Shift-8"], Menus.LAST_IN_SECTION, Menus.MenuSection.NAVIGATE_GOTO_COMMANDS);
});
