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

  selectNext(id) {
    let nextCertId = '';
    let nextIndex = '';

    this.map((cer, index) => {
      if (cer.get('id') === id) {
        nextIndex = index + 1;
      }
      if (nextIndex === index) {
        nextCertId = cer.get('id');
      }
      return true;
    });

    if (nextCertId) {
      this.select(nextCertId);
    }
  }

}
