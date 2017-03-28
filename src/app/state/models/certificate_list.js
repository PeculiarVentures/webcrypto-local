import { State } from 'quantizer';
import CertificateModel from './certificate';

export default class CertificateList extends State.List {

  constructor(value) {
    super(value, CertificateModel);
  }

  add(result) {
    const cer = this
      .where({ id: result.id });

    if (cer) {
      cer.merge(result);
    } else {
      this.push(result);
    }

    return result.id;
  }

  update(id, result) {
    const cer = this
      .where({ id });

    if (cer) {
      cer.merge(result);
    }

    return !!cer;
  }

  remove(id) {
    const cer = this.where({ id });

    if (cer) {
      super.remove(cer);
    }
  }

  select(id) {
    this.map((cer) => {
      cer.merge({ selected: false });

      if (cer.get('id') === id) {
        cer.merge({ selected: true });
      }
      return true;
    });
  }

  selectNextOrPrev(id) {
    let certIndex = 0;

    this.map((cer, index) => {
      if (cer.get('id') === id) {
        certIndex = index;
      }
      return true;
    });

    const nextIndex = certIndex + 1;
    const prevIndex = certIndex - 1;
    const children = this.children;

    if (children[nextIndex]) {
      this.select(children[nextIndex].get('id'));
    } else if (children[prevIndex]) {
      this.select(children[prevIndex].get('id'));
    }
  }

}
