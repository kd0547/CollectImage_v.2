class Node {
    constructor(data) {
        this.data = data;
        this.popularCount = 0;
        this.next = null;
        this.prev = null;
    }
}

module.exports = class LinkedList{
    constructor() {
        this.head = null;
        this.size = 0;
    }
    /**
     * 
     * @param {String} data 
     */
    append(data) {
        if (this.head == null) {
            this.head = new Node("header");
        }

        if (this.head != null) {
            var newNode = new Node(data);

            var current = this.head;
            
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
            newNode.prev = current;
            this.size++;
        }
       

    }
    /**
     * 
     * @param {String} name 
     */
    find(name) {
        if (this.head != null) {
            var current = this.head;

            //current.next != null && 
            while (current.data !== name) {
                if(current.next == null) {
                    return null;
                }
                current = current.next;
            }
            current.popularCount++;
            return current;
        }
    }
    /**
     * 
     * @param {Node} popularNode 
     */
    popularSort(popularNode) {
        var current = popularNode;

        while(current.prev != null && popularNode.popularCount >= current.prev.popularCount) {
            current = current.prev;
        }

        if(current.data === "header") {
            var temp = popularNode;

            temp.next.prev = temp.prev;
            temp.prev.next = temp.next;
            
            popularNode.next = current.next;
            current.next.prev = popularNode;

            popularNode.prev = current;
            current.next = popularNode;

            
            

        } else {
            var temp = popularNode;
            temp.prev.next = popularNode.next;

            if(temp.next != null) {
                temp.next.prev = popularNode.prev;
            } else {
                temp.next = null;
            }
            

            //prev
            popularNode.prev = current.prev;
            current.prev.next = popularNode;

            //next
            popularNode.next = current;
            current.prev = popularNode;
            
            
        }
    }
    toString() {
        let array = [];
        let current = this.head;
        while(current.next != null) {
            array.push("{ "+" data : "+current.next.data +", popularCount : "+current.next.popularCount +" }");
            current = current.next;
        }
        return array;
    }

    
}




